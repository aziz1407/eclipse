import { UseGuards } from '@nestjs/common';
import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Blog, Blogs } from '../../libs/dto/blog/blog';
import { AllBlogsInquiry, BlogInput, BlogsInquiry } from '../../libs/dto/blog/blog.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { BlogService } from './blog.service';
import { WithoutGuard } from '../auth/guards/without.guard';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { BlogUpdate } from '../../libs/dto/blog/blog.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class BlogResolver {
    constructor(private readonly blogService: BlogService) { }

    @UseGuards(AuthGuard)
    @Mutation((returns) => Blog)
    public async createBlog(
        @Args('input') input: BlogInput,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Blog> {
        console.log('Mutation: createBlog');
        return await this.blogService.createBlog(memberId, input)
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Blog)
    public async getBlog(
        @Args('blogId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Blog> {
        console.log('Query: getBlog');
        const blogId = ShapeIntoMongoObjectId(input);
        return await this.blogService.getBlog(memberId, blogId)
    }

    @Roles(MemberType.CUSTOMER, MemberType.DEALER, MemberType.MODERATOR)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Blog)
    public async updateBlog(
        @Args('input') input: BlogUpdate,
        @AuthMember('_id') memberId: ObjectId,
        @AuthMember('memberType') memberType: MemberType,
    ): Promise<Blog> {
        console.log('Mutation: updateBlog');
        input._id = ShapeIntoMongoObjectId(input._id);
        return await this.blogService.updateBlog(memberId, memberType, input)
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Blogs)
    public async getBlogs(
        @Args('input') input: BlogsInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Blogs> {
        console.log('Query: getBlogs');
        return await this.blogService.getBlogs(memberId, input)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Blog)
    public async likeTargetBlog(
        @Args('blogId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Blog> {
        console.log('Mutation: likeTargetBlog');
        const likeRefId = ShapeIntoMongoObjectId(input)
        return await this.blogService.likeTargetBlog(memberId, likeRefId);
    }

    /** ADMIN**/

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query((returns) => Blogs)
    public async getAllBlogsByAdmin(
        @Args('input') input: AllBlogsInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Blogs> {
        console.log('Query: getAllBlogsByAdmin');
        return await this.blogService.getAllBlogsByAdmin(input)
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Blog)
    public async updateBlogByAdmin(
        @Args('input') input: BlogUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Blog> {
        console.log('Mutation: updateBlogByAdmin');
        input._id = ShapeIntoMongoObjectId(input._id);
        return await this.blogService.updateBlogByAdmin(input)
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Blog)
    public async removeBlogByAdmin(
        @Args('blogId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Blog> {
        console.log('Mutation: removeBlogByAdmin');
        const articleId = ShapeIntoMongoObjectId(input);
        return await this.blogService.removeBlogByAdmin(articleId)
    }
}
