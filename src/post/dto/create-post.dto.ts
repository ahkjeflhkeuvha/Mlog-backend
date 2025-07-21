import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  thumbnail_url: string;

  @IsBoolean()
  is_uploaded: boolean;

  @IsBoolean()
  is_deleted: boolean;

  // board_id

  // user_id
}
