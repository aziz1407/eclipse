import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { BlogStatus } from '../../enums/blog-enum';
import { ObjectId } from 'mongoose';

@InputType()
export class BlogUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => BlogStatus, { nullable: true })
	blogStatus?: BlogStatus;

	@IsOptional()
	@Length(3, 50)
	@Field(() => String, { nullable: true })
	blogTitle?: string;

	@IsOptional()
	@Length(3, 250)
	@Field(() => String, { nullable: true })
	blogContent?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	blogImage?: string;
}
