import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { NotificationModule } from '../notification/notification.module';
import MemberSchema from '../../schemas/Member.model';
import { PropertyModule } from '../property/property.module';
import { BlogModule } from '../blog/blog.module';

@Module({
 imports: [
  MongooseModule.forFeature([
   { name: 'Comment', schema: CommentSchema },
   { name: 'Member', schema: MemberSchema },
  ]),
  AuthModule,
  MemberModule,
  PropertyModule,
  BlogModule,
  NotificationModule,
 ],
 providers: [CommentResolver, CommentService],
})
export class CommentModule {}