import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

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
