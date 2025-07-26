import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const post = await this.postRepository.findOne({
      where: {
        id: createContentDto.post_id,
      },
    });

    if (!post) {
      throw new NotFoundException('포스트가 존재하지 않습니다.');
    }

    const content = this.contentRepository.create({ content: createContentDto.content, post });
    await this.contentRepository.save(content);

    return content.id;
  }

  async update(content_id: number, updateContentDto: UpdateContentDto) {
    await this.contentRepository.update({ id: content_id }, { ...updateContentDto });
    return content_id;
  }

  async remove(content_id: number) {
    await this.contentRepository.delete(content_id);
    return content_id;
  }
}
