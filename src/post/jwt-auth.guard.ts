import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayloadInterface {
  sub: number;
  nickname: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const access_token = request.cookies?.['accessToken'];
    if (!access_token) return false;

    try {
      const user = this.jwtService.verify<JwtPayloadInterface>(access_token);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }
  }
}
