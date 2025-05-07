import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { PropertyModule } from '../property/property.module';
import { BlogModule } from '../blog/blog.module';
import { CommentService } from './comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Comment',
        schema: CommentSchema,
      },
    ]),
    AuthModule,
    MemberModule,
    PropertyModule,
    BlogModule,
  ],
  providers: [CommentResolver, CommentService]
})
export class CommentModule { }
