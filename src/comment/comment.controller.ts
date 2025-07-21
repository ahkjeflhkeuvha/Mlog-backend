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
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request, Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Query('type') type: string,
    @Req() req: Request,
  ) {
    const accessToken = req.cookies.accessToken;

    return await this.commentService.createComment(
      createCommentDto,
      type,
      accessToken,
    );
  }

  @Get(':post_id')
  findAllCommentsByPostId(
    @Param('post_id') post_id: number,
    @Query('type') type: string,
  ) {
    return this.commentService.findAllCommentsByPostIdOrCommentId(
      post_id,
      type,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
