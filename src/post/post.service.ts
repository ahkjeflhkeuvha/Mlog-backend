import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const newPost = this.postRepository.create(createPostDto);
    const post = await this.postRepository.save(newPost);

    return PostResponseDto.builder(post.id);
  }

  async findAllPosts() {
    const posts = await this.postRepository.find();
    return posts;
  }

  async findSavedPostsByUserId() {
    const posts = await this.postRepository.find({
      where: {
        is_uploaded: false,
      },
    });

    return posts;
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
