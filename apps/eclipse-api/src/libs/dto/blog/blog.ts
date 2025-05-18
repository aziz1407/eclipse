import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogCategory, BlogStatus } from '../../enums/blog-enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class Blog {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => BlogCategory)
	blogCategory: BlogCategory;

	@Field(() => BlogStatus)
	blogStatus: BlogStatus;

	@Field(() => String)
	blogTitle: string;

	@Field(() => String)
	blogContent: string;

	@Field(() => String, { nullable: true })
	blogImage?: string;

	@Field(() => Int)
	blogViews: number;

	@Field(() => Int)
	blogLikes: number;

	@Field(() => Int)
	blogComments: number;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Blogs {
	@Field(() => [Blog])
	list: Blog[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];

}
