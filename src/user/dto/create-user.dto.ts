import { IsEmail, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(3)
  grade: number;

  @IsInt()
  @Min(1)
  @Max(6)
  class: number;

  @IsString()
  bio: string;

  @IsString()
  profile_img: string;
}
