import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(1)
  @Max(3)
  @IsNotEmpty()
  grade: number;

  @IsInt()
  @Min(1)
  @Max(6)
  @IsNotEmpty()
  class: number;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsNotEmpty()
  profile_img: string;
}
