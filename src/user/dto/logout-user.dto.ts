import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogoutUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
