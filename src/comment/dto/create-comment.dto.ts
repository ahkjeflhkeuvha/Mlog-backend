import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @IsNotEmpty()
  post_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  parent_id: number;
}
