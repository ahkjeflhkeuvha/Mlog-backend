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
    type: string,
    accessToken: string,
  ) {
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

      let parent;

      if (type === 'child') {
        parent = await this.commentRepository.findOne({
          where: {
            id: createCommentDto.parent_id,
          },
        });

        console.log("test : ", parent);

        if (!parent) {
          throw new NotFoundException('해당하는 댓글을 찾을 수 없습니다.');
        }
      }

      const comment = this.commentRepository.create({
        ...createCommentDto,
        parent: type === 'child' ? parent : null,
        user_id: user.user_id,
      });

      await this.commentRepository.save(comment);

      // console.log('tt');

      return comment;

  }

  async findAllCommentsByPostIdOrCommentId(id: number, type: string) {
    // post id 기준 모든 댓글 가져오기
    if (type === 'post') {
      const post = await this.postRepository.findOne({
        where: {
          id,
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
    } else if (type === 'comment') {
      const comment = await this.commentRepository.findOne({
        where: {
          id,
        },
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      const childComments = await this.commentRepository.find({
        where: {
          parent: comment,
        },
        relations: ['parent'],
      });

      return childComments;
    }
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
