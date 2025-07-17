import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findAllPosts() {
    return this.postService.findAllPosts();
  }

  @Get(':id')
  finfindPostByIddOne(@Param('id') id: string) {
    return this.postService.findPostById(+id);
  }

  @Patch(':id')
  updatePostById(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePostById(+id, updatePostDto);
  }

  @Delete(':id')
  deletePostById(@Param('id') id: string) {
    return this.postService.deletePostById(+id);
  }
}
