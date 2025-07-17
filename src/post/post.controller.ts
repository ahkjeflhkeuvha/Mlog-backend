import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postService.createPost(createPostDto);
  }

  @Get()
  async findAllPosts() {
    return await this.postService.findAllPosts();
  }

  @Get('saves') // :user_id 추가
  async findSavedPostsByUserId(@Req() req) {
    console.log(req.cookies);
    return await this.postService.findSavedPostsByUserId(15);
  }

  @Get(':post_id')
  async findPostById(@Param('post_id') post_id: string) {
    return await this.postService.findPostById(+post_id);
  }

  @Get(':user_id/posts')
  async getAllPostsByUserId(@Param('user_id') user_id: number) {
    return await this.postService.getAllPostsByUserId(+user_id);
  }

  @Patch(':post_id')
  async updatePostById(
    @Param('post_id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePostById(+id, updatePostDto);
  }

  @Delete(':post_id')
  async deletePostById(@Param('post_id') id: string) {
    return await this.postService.deletePostById(+id);
  }
}
