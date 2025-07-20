import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentController],
  providers: [
    CommentService,
    UserService,
    JwtService,
    ConfigService,
    TokenService,
  ],
})
export class CommentModule {}
