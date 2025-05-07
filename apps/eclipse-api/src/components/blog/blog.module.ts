import { Module } from '@nestjs/common';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import BlogScehma from '../../schemas/Blog.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Blog',
        schema: BlogScehma,
      },
    ]),
    AuthModule,
    MemberModule,
    ViewModule,
    LikeModule,
  ],
  providers: [BlogResolver, BlogService],
  exports: [BlogService]
})
export class BlogModule { }
