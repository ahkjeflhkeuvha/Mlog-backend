import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.createUser(createUserDto, res);
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log('email : ', email);
    return this.userService.login(loginUserDto.email, res);
  }

  @Post('logout')
  logout(
    @Body() logoutUserDto: LogoutUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.logout(logoutUserDto.email, res);
  }

  @Post('refresh')
  refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    console.log(refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    return this.userService.refreshAccessToken(refreshToken, res);
  }

  @Get(':user_id')
  getUserInfoByUserId(@Param('user_id') id: string) {
    return this.userService.getUserInfoByUserId(+id);
  }

  @Patch(':user_id')
  updateUserInfo(
    @Param('user_id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserInfo(+id, updateUserDto);
  }

  @Delete(':user_id')
  removeUser(@Param('user_id') id: string) {
    return this.userService.removeUser(+id);
  }
}
