import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtPayloadInterface } from './jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Content } from '../content/entities/content.entity';
import { ContentService } from '../content/content.service';

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
    private readonly userService: UserService,
    private readonly contentService: ContentService,
  ) {}

  async createPost(createPostDto: CreatePostDto, accessToken: string) {
    try {
      const payload: JwtPayloadInterface = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('사용 가능한 토큰이 아닙니다.');
      }

      const newPost = this.postRepository.create({
        title: createPostDto.title,
        thumbnail_url: createPostDto.thumbnail_url,
        is_uploaded: createPostDto.is_uploaded,
        is_deleted: createPostDto.is_deleted,
        user,
      });

      const post = await this.postRepository.save(newPost);

      await this.contentService.create({ content: createPostDto.content, post_id: post.id });

      return PostResponseDto.builder(post.id);
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  async findAllPosts() {
    const posts = await this.postRepository.find();
    return posts;
  }

  async findPostsByTypeAndUser(type: string, accessToken: string) {
    try {
      const payload: JwtPayloadInterface = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('해당 아이디에 일치하는 사용자가 없습니다.');
      }

      const posts = await this.postRepository.find({
        where: {
          is_uploaded: type === 'uploaded',
          user,
        },
        relations: ['content', 'comments'],
      });

      return posts;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  async findPostById(post_id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: post_id,
      },
      relations: ['comments', 'content'],
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
      throw new NotFoundException('해당하는 아이디의 사용자를 찾을 수 없습니다.');
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

    await this.postRepository.update(
      { id: post_id },
      {
        title: updatePostDto.title,
        thumbnail_url: updatePostDto.title,
        is_deleted: updatePostDto.is_deleted,
        is_uploaded: updatePostDto.is_uploaded,
      },
    );

    await this.contentService.update(post.content.id, { content: updatePostDto.content });

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
