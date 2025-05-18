import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
    AgentPropertiesInquiry,
    AllPropertiesInquiry,
    OrdinaryInquiry,
    PropertiesInquiry,
    PropertyInput
} from '../../libs/dto/property/property.input';
import { Properties, Property } from '../../libs/dto/property/property';
import { Direction, Message } from '../../libs/enums/common_enum';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { WatchStatus } from '../../libs/enums/property.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import * as moment from 'moment'
import { ShapeIntoMongoObjectId, lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { WASI } from 'node:wasi';
import { MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel('Property') private readonly propertyModel: Model<Property>,
        private memberService: MemberService,
        private viewService: ViewService,
        private likeService: LikeService
    ) { }

    public async createProperty(input: PropertyInput): Promise<Property> {
        try {
            console.log('executed');
            const result = await this.propertyModel.create(input);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: 1,
            })
            return result;
        } catch (err) {
            console.log("Error, Service.model:", err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }

    public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
        const search: T = {
            _id: propertyId,
            propertyStatus: WatchStatus.AVAILABLE,
        };

        const targetProperty: Property | null = await this.propertyModel.findOne(search).lean().exec();
        if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
                targetProperty.propertyViews++;
            }
            // melicked
            const LikeInput = { memberId: memberId, likeRefId: propertyId, likeGroup: LikeGroup.PROPERTY };
            targetProperty.meLiked = await this.likeService.checkLikeExistence(LikeInput)
        }

        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        return targetProperty;
    }

    public async updateProperty(
        memberId: ObjectId,
        memberType: MemberType,
        input: PropertyUpdate
    ): Promise<Property> {
        let { propertyStatus, soldAt, deletedAt } = input;
    
        const search: any = {
            _id: input._id,
            propertyStatus: WatchStatus.AVAILABLE,
        };
    
        if (memberType === MemberType.DEALER) {
            search.memberId = memberId; // restrict dealers to their own properties
        }
    
        if (propertyStatus === WatchStatus.SOLD) soldAt = moment().toDate();
        else if (propertyStatus === WatchStatus.DELETE) deletedAt = moment().toDate();
    
        const result = await this.propertyModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
    
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    
        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }
    
        return result;
    }

    public async getProperties(memberId: ObjectId, input: PropertiesInquiry): Promise<Properties> {
        const match: T = { propertyStatus: WatchStatus.AVAILABLE };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        this.shapeMatchQuery(match, input);
        console.log('match:', match);

        const result = await this.propertyModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit },
                            lookupAuthMemberLiked(memberId),
                            lookupMember,
                            { $unwind: '$memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    private shapeMatchQuery(match: T, input: PropertiesInquiry): void {
        const {
            memberId,
            locationList,
            propertyCategory,
            propertyMaterial,
            propertyCondition,
            propertyMovement,
            typeList,
            pricesRange,
            options,
            text,
        } = input.search;
        if (memberId) match.memberId = ShapeIntoMongoObjectId(memberId);
        if (locationList) match.propertyCountry = { $in: locationList };
        if (propertyCategory) match.propertyCategory = { $in: propertyCategory };
        if (propertyCondition) match.propertyCondition = { $in: propertyCondition };
        if (propertyMaterial) match.propertyMaterial = { $in: propertyMaterial };
        if (propertyMovement) match.propertyMovement = { $in: propertyMovement };
        if (typeList) match.propertyBrand = { $in: typeList };

        if (pricesRange) match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
        if (text) match.propertyTitle = { $regex: new RegExp(text, 'i') };
        if (options) {
            match['$or'] = options.map((ele) => {
                return { [ele]: true };
            });
        }
    }

    public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
        return await this.likeService.getFavoriteProperties(memberId, input);
    }

    public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
        return await this.viewService.getVisitedProperties(memberId, input);
    }

    public async getAgentProperties(memberId: ObjectId, input: AgentPropertiesInquiry): Promise<Properties> {
        const { propertyStatus } = input.search;
        if (propertyStatus === WatchStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

        const match: T = {
            memberId: memberId,
            propertyStatus: propertyStatus ?? { $ne: WatchStatus.DELETE },
        };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        const result = await this.propertyModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit },
                            lookupMember, // propertimizni memberIdsini boshqa kollekshindan lookup qilyapmiz
                            { $unwind: '$memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    public async likeTargetProperty(memberId: ObjectId, likeRefId: ObjectId): Promise<Property> {
        const target: Property | null = await this.propertyModel
            .findOne({ _id: likeRefId, propertyStatus: WatchStatus.AVAILABLE })
            .exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.PROPERTY
        }

        const modifier: number = await this.likeService.toggleLike(input)
        const result = await this.propertyStatsEditor({ _id: likeRefId, targetKey: 'propertyLikes', modifier: modifier });

        if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        return result;
    }

    public async getAllPropertiesByAdmin(input: AllPropertiesInquiry): Promise<Properties> {
        const { propertyStatus, propertyLocationList } = input.search;
        const match: T = {};
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        if (propertyStatus) match.propertyStatus = propertyStatus;
        if (propertyLocationList) match.propertyLocation = { $in: propertyLocationList };

        const result = await this.propertyModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit }, // [property1 ,property2]
                            lookupMember, // memberDate: [memberDataValue]
                            { $unwind: '$memberData' }, // memberData: memberDataValue
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    public async updatePropertyByAdmin(input: PropertyUpdate): Promise<Property> {
        let { propertyStatus, soldAt, deletedAt } = input;
        const search: T = {
            _id: input._id,
            propertyStatus: WatchStatus.AVAILABLE,
        };

        if (propertyStatus === WatchStatus.SOLD) soldAt = moment().toDate();
        else if (propertyStatus === WatchStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.propertyModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }

        return result;
    }

    public async removePropertyByAdmin(propertyId: ObjectId): Promise<Property> {
        const search: T = { _id: propertyId, propertyStatus: WatchStatus.DELETE };
        const result = await this.propertyModel.findOneAndDelete(search).exec();
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }

    public async propertyStatsEditor(input: StatisticModifier): Promise<Property | null> {
        const { _id, targetKey, modifier } = input;
        return await this.propertyModel
            .findByIdAndUpdate(
                _id,
                { $inc: { [targetKey]: modifier } },
                {
                    new: true,
                },
            )
            .exec();
    }
}