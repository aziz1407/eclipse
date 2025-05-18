import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { WatchCountry, WatchCondition, WatchBrand, WatchStatus, WatchGender, WatchMaterial, WatchMovement } from '../../enums/property.enum';
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

@ObjectType()
export class Property {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => WatchBrand)
    propertyBrand: WatchBrand;

    @Field(() => WatchStatus)
    propertyStatus: WatchStatus;

    @Field(() => WatchCountry)
    propertyCountry: WatchCountry;

    @Field(() => String)
    propertyAddress: string;

    @Field(() => String)
    propertyModel: string;

    @Field(() => WatchGender)
    propertyCategory: WatchGender;

    @Field(() => WatchMaterial)
    propertyMaterial: WatchMaterial

    @Field(() => Number)
    propertyPrice: number;

    @Field(() => Number)
    propertyYear: number;

    @Field(() => WatchCondition)
    propertyCondition: WatchCondition;

    @Field(() => WatchMovement)
    propertyMovement: WatchMovement;

    @Field(() => Int)
    propertyViews: number;

    @Field(() => Int)
	propertyLikes: number;

    @Field(() => Number)
    propertyRank: number;

    @Field(() => [String])
    propertyImages: string[];

    @Field(() => String, { nullable: true })
    propertyDesc?: string;

    // @Field(() => Boolean)
    // propertyBarter: boolean;

    // @Field(() => Boolean)
    // propertyRent: boolean;

    @Field(() => String)
    memberId: ObjectId;

    @Field(() => Date, { nullable: true })
    soldAt?: Date;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;

    @Field(() => Date, { nullable: true })
    constructedAt?: Date;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt: Date;

    // Aggregation results
    @Field(() => [MeLiked], { nullable: true })
    meLiked?: MeLiked[];

    @Field(() => Member, { nullable: true })
    memberData?: Member;
}

@ObjectType()
export class Properties {
    @Field(() => [Property])
    list: Property[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter: TotalCounter[];
}
