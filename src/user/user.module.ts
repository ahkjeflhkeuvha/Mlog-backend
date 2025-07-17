import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [UserController],
  providers: [UserService, JwtService, ConfigService, JwtAuthGuard],
})
export class UserModule {}
