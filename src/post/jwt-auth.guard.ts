import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  nickname: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const access_token = request.cookies?.['access_token'];
    if (!access_token) return false;

    try {
      const user = this.jwtService.verify<JwtPayload>(access_token);
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }
}
