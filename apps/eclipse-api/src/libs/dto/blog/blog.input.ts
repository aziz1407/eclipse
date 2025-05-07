import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { BlogCategory, BlogStatus } from '../../enums/blog-enum';
import { Direction } from '../../enums/common_enum';
import { availableBlogSorts } from '../../config';

@InputType()
export class BlogInput {
	@IsNotEmpty()
	@Field(() => BlogCategory)
	blogCategory: BlogCategory;

	@IsNotEmpty()
	@Length(3, 70)
	@Field(() => String)
	blogTitle: string;

	@IsNotEmpty()
	@Length(3, 500)
	@Field(() => String)
	blogContent: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	blogImage?: string;

	memberId?: ObjectId;
}

@InputType()
class BAISearch {
	@IsOptional()
	@Field(() => BlogCategory, { nullable: true })
	blogCategory?: BlogCategory;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;
}

@InputType()
export class BlogsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableBlogSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => BAISearch)
	search: BAISearch;
}

@InputType()
class ABAISearch {
	@IsOptional()
	@Field(() => BlogStatus, { nullable: true })
	blogStatus?: BlogStatus;

	@IsOptional()
	@Field(() => BlogCategory, { nullable: true })
	blogCategory?: BlogCategory;
}

@InputType()
export class AllBlogsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableBlogSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ABAISearch)
	search: ABAISearch;
}
