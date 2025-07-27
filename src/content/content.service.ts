import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createContentDto: CreateContentDto, qr: QueryRunner) {
    const post = await qr.manager.findOne(Post, {
      where: {
        id: createContentDto.post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('포스트가 존재하지 않습니다.');
    }

    const content = qr.manager.create(Content, { content: createContentDto.content, post });
    await qr.manager.save(Content, content);

    return content.id;
  }

  async update(content_id: number, updateContentDto: UpdateContentDto, qr: QueryRunner) {
    await qr.manager.update(Content, { id: content_id }, { ...updateContentDto });
    return content_id;
  }

  async remove(content_id: number, qr: QueryRunner) {
    await qr.manager.delete(Content, content_id);
    return content_id;
  }
}
