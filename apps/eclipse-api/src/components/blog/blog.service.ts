import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Blog, Blogs } from '../../libs/dto/blog/blog';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import {
  AllBlogsInquiry,
  BlogInput,
  BlogsInquiry,
} from '../../libs/dto/blog/blog.input';
import { Direction, Message } from '../../libs/enums/common_enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { BlogStatus } from '../../libs/enums/blog-enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { BlogUpdate } from '../../libs/dto/blog/blog.update';
import {
  ShapeIntoMongoObjectId,
  lookupAuthMemberLiked,
  lookupMember,
} from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    private readonly memberService: MemberService,
    private readonly viewService: ViewService,
    private readonly likeService: LikeService,
  ) {}

  public async createBlog(
    memberId: ObjectId,
    input: BlogInput,
  ): Promise<Blog> {
    input.memberId = memberId; // <= Nega bu try ichida emas?
    try {
      const result = await this.blogModel.create(input);
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberBlogs',
        modifier: 1,
      });

      return result;
    } catch (err) {
      console.log('Error, Service.model:', err.message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async getBlog(memberId: ObjectId, blogId: ObjectId): Promise<Blog> {
    const search: T = {
      _id: blogId,
      blogStatus: BlogStatus.ACTIVE,
    };

    const targetedBlog: Blog | null = await this.blogModel
      .findOne(search)
      .lean()
      .exec();
    if (!targetedBlog)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput = {
        memberId: memberId,
        viewRefId: blogId,
        viewGroup: ViewGroup.ARTICLE,
      }; // men , nimani ,qayerdan
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.blogStatisticsEditor({
          _id: blogId,
          targetKey: 'blogViews',
          modifier: 1,
        });
        targetedBlog.blogViews++;
      }
      //meliked
      const LikeInput = {
        memberId: memberId,
        likeRefId: blogId,
        likeGroup: LikeGroup.ARTICLE,
      };
      targetedBlog.meLiked =
        await this.likeService.checkLikeExistence(LikeInput);
    }

    targetedBlog.memberData = await this.memberService.getMember(
      null,
      targetedBlog.memberId,
    );
    return targetedBlog;
  }

  public async updateBlog(
    memberId: ObjectId,
    memberType: MemberType,
    input: BlogUpdate,
  ): Promise<Blog> {
    const { _id, blogStatus } = input;

    const query: any = {
      _id: _id,
      blogStatus: BlogStatus.ACTIVE,
    };

    if (memberType !== MemberType.MODERATOR) {
      query.memberId = memberId;
    }

    const result = await this.blogModel
      .findOneAndUpdate(query, input, {
        new: true,
      })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (blogStatus === BlogStatus.DELETE) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberBlogs',
        modifier: -1,
      });
    }

    return result;
  }

  public async getBlogs(
    memberId: ObjectId,
    input: BlogsInquiry,
  ): Promise<Blogs> {
    const { blogCategory, text } = input.search;
    const match: T = { blogStatus: BlogStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (blogCategory) match.blogCategory = blogCategory;
    if (text) match.blogTitle = { $regex: new RegExp(text, 'i') }; // ?
    if (input.search?.memberId) {
      match.memberId = ShapeIntoMongoObjectId(input.search.memberId);
    }

    console.log('match:', match);

    const result = await this.blogModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupAuthMemberLiked(memberId),
              lookupMember, // idni boshqa kollekshindan lookup qilyapmiz
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  public async likeTargetBlog(
    memberId: ObjectId,
    likeRefId: ObjectId,
  ): Promise<Blog> {
    const target: Blog | null = await this.blogModel
      .findOne({ _id: likeRefId, blogStatus: BlogStatus.ACTIVE })
      .exec();
    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.ARTICLE,
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.blogStatisticsEditor({
      _id: likeRefId,
      targetKey: 'blogLikes',
      modifier: modifier,
    });

    if (!result)
      throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;
  }

  public async getAllBlogsByAdmin(
    input: AllBlogsInquiry,
  ): Promise<Blogs> {
    const { blogStatus, blogCategory } = input.search;

    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (blogStatus) match.blogStatus = blogStatus;
    if (blogCategory) match.blogCategory = blogCategory;

    const result = await this.blogModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  public async updateBlogByAdmin(input: BlogUpdate): Promise<Blog> {
    const { _id, blogStatus } = input;

    const result = await this.blogModel
      .findOneAndUpdate({ _id: _id, blogStatus: BlogStatus.ACTIVE }, input, {
        new: true,
      })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if ( blogStatus === BlogStatus.DELETE) {
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberBlogs',
        modifier: -1,
      });
    }

    return result;
  }

  public async removeBlogByAdmin(articleId: ObjectId): Promise<Blog> {
    const search: T = { _id: articleId, articleStatus: BlogStatus.DELETE };
    const result = await this.blogModel.findOneAndDelete(search).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

    return result;
  }

  public async blogStatisticsEditor(
    input: StatisticModifier,
  ): Promise<Blog | null> {
    const { _id, targetKey, modifier } = input;
    return await this.blogModel
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
