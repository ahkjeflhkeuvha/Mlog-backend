import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/post/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), TokenModule],
  controllers: [UserController],
  providers: [UserService, JwtService, ConfigService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}
