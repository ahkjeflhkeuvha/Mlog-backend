import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Profile } from 'passport-google-oauth20';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

export interface JwtPayloadInterface {
  sub: number;
  nickname: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  // strategy 에서 호출
  validateSocialUser(profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email.endsWith('@e-mirim.hs.kr')) {
      throw new UnauthorizedException('미림 계정만 로그인할 수 있습니다.');
    }

    return {
      email,
      profile_img: profile.photos[0].value,
    };
  }

  async login(email: string, response: Response) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('해당하는 이메일의 사용자가 없습니다.');
    }

    const refreshToken = await this.tokenService.issueToken(user, true);
    const accessToken = await this.tokenService.issueToken(user, false);

    // 로그인 시 로그인 토큰 갱신
    await this.userRepository.update(
      { email: user.email },
      {
        refresh_token: refreshToken,
      },
    );

    response.cookie('refreshToken', refreshToken);
    response.cookie('accessToken', accessToken);

    const updatedUser = await this.userRepository.findOne({
      where: {
        email: user.email,
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

      const newAccessToken = await this.tokenService.issueToken(user, false);

      // refreshToken도 주기적으로 갱신
      await this.userRepository.save(user);

      response.cookie('accessToken', newAccessToken);

      console.log(newAccessToken);

      return newAccessToken;
    } catch (err) {
      throw new UnauthorizedException(
        'refreshToken이 만료되었거나 잘못되었습니다.',
      );
    }
  }
}
