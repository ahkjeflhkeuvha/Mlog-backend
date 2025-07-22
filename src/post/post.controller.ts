import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Response, Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.postService.createPost(
      createPostDto,
      req.cookies.accessToken,
      req.cookies.refreshToken,
      res,
    );
  }

  @Get()
  async findAllPosts() {
    return await this.postService.findAllPosts();
  }

  @Get(':type') // :user_id 추가
  async findSavedPostsByUserId(
    @Param('type') type: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.postService.findPostsByTypeAndUser(
      type,
      req.cookies.accessToken,
      req.cookies.refreshToken,
      res,
    );
  }

  @Get(':id/test')
  async findPostById(@Param('id', ParseIntPipe) post_id: string) {
    console.log('test', post_id);
    return await this.postService.findPostById(+post_id);
  }

  @Get(':user_id/posts')
  async getAllPostsByUserId(@Param('user_id', ParseIntPipe) user_id: number) {
    return await this.postService.getAllPostsByUserId(+user_id);
  }

  @Patch(':post_id')
  async updatePostById(
    @Param('post_id', ParseIntPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePostById(+id, updatePostDto);
  }

  @Delete(':post_id')
  async deletePostById(@Param('post_id', ParseIntPipe) id: string) {
    return await this.postService.deletePostById(+id);
  }
}
