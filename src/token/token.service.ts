import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
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
        expiresIn: isRefresh ? '30d' : 300,
      },
    );
  }
}
