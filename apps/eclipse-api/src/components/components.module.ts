import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MemberModule,
    AuthModule,
    PropertyModule,
    BlogModule,
    CommentModule,
    LikeModule,
    ViewModule,
    FollowModule,
    NotificationModule,
  ],
})
export class ComponentsModule { }
