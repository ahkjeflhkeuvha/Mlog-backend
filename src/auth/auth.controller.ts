import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './jwt-social-google.guard';
import { LogoutUserDto } from 'src/user/dto/logout-user.dto';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // 자동으로 redirect 됨
    console.log('GET google/login');
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@Req() req: Request & { user: User }) {
    // 유저 정보 전송 역할
    return req.user;
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto.email, res);
  }

  @Post('logout')
  logout(
    @Body() logoutUserDto: LogoutUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(logoutUserDto.email, res);
  }

  @Post('refresh')
  refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    return this.authService.refreshAccessToken(refreshToken, res);
  }
}
