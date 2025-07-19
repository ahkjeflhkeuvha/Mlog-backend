import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(createUserDto: CreateUserDto, response: Response) {
    const user = this.userRepository.create(createUserDto);

    const refreshToken = await this.tokenService.issueToken(user, true);
    const accessToken = await this.tokenService.issueToken(user, false);

    response.cookie('refreshToken', refreshToken);
    response.cookie('accessToken', accessToken);

    user.refresh_token = refreshToken;

    await this.userRepository.save(user);

    return {
      refreshToken,
      accessToken,
    };
  }

  async login(email: string, response: Response) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('해당하는 이메일의 사용자가 없습니다.');
    }

    const refreshToken = await this.issueToken(user, true);
    const accessToken = await this.issueToken(user, false);

    // 로그인 시 로그인 토큰 갱신
    await this.userRepository.update(
      { email },
      {
        refresh_token: refreshToken,
      },
    );

    response.cookie('refreshToken', refreshToken);
    response.cookie('accessToken', accessToken);

    const updatedUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return updatedUser;
  }

  async logout(email: string, response: Response) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('해당하는 이메일의 사용자가 없습니다.');
    }

    await this.userRepository.update(
      { email: email },
      {
        refresh_token: '',
      },
    );

    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
  }

  async refreshAccessToken(refreshToken: string, response: Response) {
    try {
      const payload: JwtPayloadInterface = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        },
      );

      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
      });

      if (!user || user.refresh_token !== refreshToken) {
        throw new UnauthorizedException('유효하지 않은 refreshToken입니다.');
      }

      const newAccessToken = await this.issueToken(user, false);

      // refreshToken도 주기적으로 갱신
      await this.userRepository.save(user);

      response.cookie('accessToken', newAccessToken);

      // console.log(newAccessToken);

      return newAccessToken;
    } catch (err) {
      throw new UnauthorizedException(
        'refreshToken이 만료되었거나 잘못되었습니다.',
      );
    }
  }

  async getUserInfoByUserId(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id,
      },
      relations: ['posts'],
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
