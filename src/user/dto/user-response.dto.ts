import { IsNumber } from 'class-validator';

export class UserResponseDto {
  @IsNumber()
  id: number;

  static builder(id: number): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = id;
    return dto;
  }
}
