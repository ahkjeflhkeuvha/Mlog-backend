import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async issueToken(user: User, isRefresh: boolean): Promise<string> {
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );

    return await this.jwtService.signAsync(
      {
        sub: user.user_id,
        nickname: user.nickname,
        type: isRefresh ? 'refresh' : 'access',
      },
      {
        secret: isRefresh ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefresh ? '1m' : 300,
      },
    );
  }

  async createUser(createUserDto: CreateUserDto, response: Response) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    const refreshToken = await this.issueToken(user, true);
    const accessToken = await this.issueToken(user, false);

    response.cookie('refreshToken', refreshToken);
    response.cookie('accessToken', accessToken);

    return {
      refreshToken,
      accessToken,
    };
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

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
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
