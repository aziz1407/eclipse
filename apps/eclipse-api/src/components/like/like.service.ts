import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { Model, ObjectId } from 'mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common_enum';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import {
  NotificationGroup,
  NotificationType,
} from '../../libs/enums/notification.enum';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private readonly likeModel: Model<Like>,
    private readonly notificationService: NotificationService,
    @InjectModel('Property') private readonly propertyModel: Model<any>,
    @InjectModel('Blog') private readonly blogModel: Model<any>,
    @InjectModel('Member') private readonly memberModel: Model<any>,
  ) {}

  public async toggleLike(input: LikeInput): Promise<number> {
    const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
      exist = await this.likeModel.findOne(search).exec();
    let modifier = 1;

    if (exist) {
      await this.likeModel.findOneAndDelete(search).exec();
      modifier = -1;
    } else {
      try {
        await this.likeModel.create(input);

        // Get the correct receiverId and content info based on the like group
        let receiverId = input.likeRefId.toString();
        let notificationDesc = '';

        // Get the liker's name
        const liker = await this.memberModel.findById(input.memberId).exec();
        const likerName = liker ? liker.memberNick : 'Someone';

        if (input.likeGroup === LikeGroup.PROPERTY) {
          const property = await this.propertyModel
            .findById(input.likeRefId)
            .exec();
          if (property) {
            receiverId = property.memberId.toString();
            notificationDesc = `${likerName} liked your property "${property.propertyModel}"`;
          }
        } else if (input.likeGroup === LikeGroup.BLOG) {
          const blog = await this.blogModel.findById(input.likeRefId).exec();
          if (blog) {
            receiverId = blog.memberId.toString();
            notificationDesc = `${likerName} liked your blog "${blog.blogTitle}"`;
          }
        } else if (input.likeGroup === LikeGroup.MEMBER) {
          notificationDesc = `${likerName} liked your profile`;
        }

        await this.notificationService.createNotification({
          notificationType: NotificationType.LIKE,
          notificationGroup: this.mapLikeGroupToNotificationGroup(
            input.likeGroup,
          ),
          notificationTitle: 'New Like',
          notificationDesc: notificationDesc,
          authorId: input.memberId.toString(),
          receiverId: receiverId,
        });
      } catch (err) {
        console.log('Error, Service.model: ', err.message);
        throw new BadRequestException(Message.CREATE_FAILED);
      }
    }
    console.log(`- Like modifier ${modifier} -`);
    return modifier;
  }

  private mapLikeGroupToNotificationGroup(
    likeGroup: LikeGroup,
  ): NotificationGroup {
    switch (likeGroup) {
      case LikeGroup.PROPERTY:
        return NotificationGroup.PROPERTY;
      case LikeGroup.BLOG:
        return NotificationGroup.BLOG;
      case LikeGroup.MEMBER:
        return NotificationGroup.MEMBER;
      default:
        return NotificationGroup.MEMBER;
    }
  }

  public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
    const { memberId, likeRefId } = input;
    const result = await this.likeModel
      .findOne({ memberId: memberId, likeRefId: likeRefId })
      .exec();
    return result
      ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }]
      : [];
  }

  public async getFavoriteProperties(
    memberId: ObjectId,
    input: OrdinaryInquiry,
  ): Promise<Properties> {
    const { page, limit } = input;
    const match: T = { likeGroup: LikeGroup.PROPERTY, memberId: memberId };

    const data: T = await this.likeModel
      .aggregate([
        { $match: match },
        { $sort: { updatedAt: -1 } },
        {
          $lookup: {
            from: 'watches',
            localField: 'likeRefId',
            foreignField: '_id',
            as: 'favoriteProperty',
          },
        },
        { $unwind: '$favoriteProperty' },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupFavorite,
              { $unwind: '$favoriteProperty.memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    const result: Properties = { list: [], metaCounter: data[0].metaCounter };
    result.list = data[0].list.map((ele) => ele.favoriteProperty);
    return result;
  }
}
