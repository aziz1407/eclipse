import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Follower, Followers, Followings } from '../../libs/dto/follow/follow';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';

@Resolver()
export class FollowResolver {
    constructor(private readonly followService: FollowService) { }

    @UseGuards(AuthGuard)
    @Mutation(() => Follower)
    public async subscribe(
        @Args('input') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Follower> {
        console.log("Mutation: subscribe");
        const followingId = ShapeIntoMongoObjectId(input);
        return await this.followService.subscribe(memberId, followingId);
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => Follower)
    public async unsubscribe(
        @Args('input') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Follower> {
        console.log('Mutation: unsubscribe');
        const followingId = ShapeIntoMongoObjectId(input);
        return await this.followService.unsubscribe(memberId, followingId);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Followings)
    public async getMemberFollowings(
        @Args('input') input: FollowInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Followings> {
        console.log('Query: getMemberFollowings');
        const { followerId } = input.search
        input.search.followerId = ShapeIntoMongoObjectId(followerId);
        return await this.followService.getMemberFollowings(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Followers)
    public async getMemberFollowers(
        @Args('input') input: FollowInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Followers> {
        console.log('Query: getMemberFollowers');
        const { followingId } = input.search
        input.search.followingId = ShapeIntoMongoObjectId(followingId);
        return await this.followService.getMemberFollowers(memberId, input);
    }
}

