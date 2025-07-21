import { IsNumber } from 'class-validator';

export class PostResponseDto {
  @IsNumber()
  id: number;

  static builder(id: number): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = id;
    return dto;
  }
}
