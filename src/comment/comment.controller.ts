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
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request, Response } from 'express';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Query('type') type: string,
    @Req() req: Request,
  ) {
    const qr = req.qr;

    return await this.commentService.createComment(
      createCommentDto,
      type,
      req.cookies.accessToken,
      qr,
    );
  }

  @Get(':post_id')
  @UseInterceptors(TransactionInterceptor)
  findAllCommentsByPostId(
    @Param('post_id') post_id: number,
    @Query('type') type: string,
    @Req() req: Request,
  ) {
    const qr = req.qr;
    return this.commentService.findAllCommentsByPostIdOrCommentId(post_id, type, qr);
  }

  @Patch(':id')
  @UseInterceptors(TransactionInterceptor)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: Request) {
    const qr = req.qr;
    return this.commentService.update(+id, updateCommentDto, req.cookies.accessToken, qr);
  }

  @Delete(':id')
  @UseInterceptors(TransactionInterceptor)
  remove(@Param('id') id: string, @Req() req: Request) {
    const qr = req.qr;
    return this.commentService.remove(+id, req.cookies.accessToken, qr);
  }
}
