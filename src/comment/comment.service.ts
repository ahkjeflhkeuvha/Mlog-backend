import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from 'src/post/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    accessToken: string,
    refreshToken: string,
    res: Response,
  ) {
    try {
      const payload: JwtPayloadInterface = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        },
      );

      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
      });

      // console.log(user);

      if (!user) {
        throw new NotFoundException(
          '해당 아이디에 일치하는 사용자가 없습니다.',
        );
      }

      const comment = this.commentRepository.create({
        ...createCommentDto,
        user_id: user.user_id,
      });

      await this.commentRepository.save(comment);

      // console.log('tt');

      return comment;
    } catch (err) {
      const newAccessToken = await this.userService.refreshAccessToken(
        refreshToken,
        res,
      );

      return await this.createComment(
        createCommentDto,
        newAccessToken,
        refreshToken,
        res,
      );
    }
  }

  async findAllCommentsByPostId(post_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    const comments = await this.commentRepository.find({
      where: {
        post,
      },
    });

    return comments;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
