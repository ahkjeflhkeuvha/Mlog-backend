import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return UserResponseDto.builder(user.user_id);
  }

  async getUserInfoByUserId(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('해당하는 아이디의 유저가 없습니다.');
    }

    return user;
  }

  async updateUserInfo(user_id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('해당하는 아이디의 유저가 없습니다.');
    }

    await this.userRepository.update({ user_id }, { ...updateUserDto });

    return user_id;
  }

  async removeUser(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('해당하는 아이디의 유저가 없습니다.');
    }

    await this.userRepository.delete({ user_id });

    return user_id;
  }
}
