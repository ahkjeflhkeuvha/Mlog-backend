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
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Response, Request } from 'express';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const qr = req.qr;
    return await this.postService.createPost(createPostDto, req.cookies.accessToken, qr);
  }

  @Get()
  @UseInterceptors(TransactionInterceptor)
  async findAllPosts(@Req() req: Request) {
    const qr = req.qr;
    return await this.postService.findAllPosts(qr);
  }

  @Get(':type') // :user_id 추가
  @UseInterceptors(TransactionInterceptor)
  async findSavedPostsByUserId(@Param('type') type: string, @Req() req: Request) {
    const qr = req.qr;
    return await this.postService.findPostsByTypeAndUser(type, req.cookies.accessToken, qr);
  }

  @Get(':id/test')
  @UseInterceptors(TransactionInterceptor)
  async findPostById(@Param('id', ParseIntPipe) post_id: string, @Req() req: Request) {
    const qr = req.qr;
    return await this.postService.findPostById(+post_id, qr);
  }

  @Get(':user_id/posts')
  @UseInterceptors(TransactionInterceptor)
  async getAllPostsByUserId(@Param('user_id', ParseIntPipe) user_id: number, @Req() req: Request) {
    const qr = req.qr;
    return await this.postService.getAllPostsByUserId(+user_id, qr);
  }

  @Patch(':post_id')
  @UseInterceptors(TransactionInterceptor)
  async updatePostById(
    @Param('post_id', ParseIntPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const qr = req.qr;
    return await this.postService.updatePostById(+id, updatePostDto, req.cookies.accessToken, qr);
  }

  @Delete(':post_id')
  @UseInterceptors(TransactionInterceptor)
  async deletePostById(@Param('post_id', ParseIntPipe) id: string, @Req() req: Request) {
    const qr = req.qr;
    return await this.postService.deletePostById(+id, req.cookies.accessToken, qr);
  }
}
