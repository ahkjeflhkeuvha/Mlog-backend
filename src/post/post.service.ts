import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { JwtPayloadInterface } from './jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

interface JwtPayload {
  sub: number;
  email: string;
  type: string;
}
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
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

      if (!user) {
        throw new NotFoundException('사용 가능한 토큰이 아닙니다.');
      }

      const newPost = this.postRepository.create({
        ...createPostDto,
        user,
      });

      const post = await this.postRepository.save(newPost);

      return PostResponseDto.builder(post.id);
    } catch (err) {
      const newAccessToken = await this.authService.refreshAccessToken(
        refreshToken,
        res,
      );

      return await this.createPost(
        createPostDto,
        newAccessToken,
        refreshToken,
        res,
      );
    }
  }

  async findAllPosts() {
    const posts = await this.postRepository.find();
    return posts;
  }

  async findPostsByTypeAndUser(
    type: string,
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

      if (!user) {
        throw new NotFoundException(
          '해당 아이디에 일치하는 사용자가 없습니다.',
        );
      }

      const posts = await this.postRepository.find({
        where: {
          is_uploaded: type === 'uploaded' ? true : false,
          user,
        },
      });

      return posts;
    } catch (err) {
      const newAccessToken = await this.userService.refreshAccessToken(
        refreshToken,
        res,
      );
      console.log('test ; ', newAccessToken);
      return await this.findPostsByTypeAndUser(
        type,
        newAccessToken,
        refreshToken,
        res,
      );
    }
  }

  async findPostById(post_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: post_id,
      },
    });
    return post;
  }

  async getAllPostsByUserId(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        '해당하는 아이디의 사용자를 찾을 수 없습니다.',
      );
    }

    const posts = await this.postRepository.find({
      where: {
        user,
      },
    });

    return posts;
  }

  async updatePostById(post_id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: {
        id: post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('아이디에 해당하는 포스트가 없습니다.');
    }

    await this.postRepository.update({ id: post_id }, { ...updatePostDto });

    return post_id;
  }

  async deletePostById(post_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('아이디에 해당하는 포스트가 없습니다.');
    }

    await this.postRepository.update(
      { id: post_id },
      {
        is_deleted: true,
      },
    );
    return post_id;
  }
}
