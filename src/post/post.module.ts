import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `5m`,
        },
      }),
    }),
    AuthModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    ConfigService,
    JwtService,
    AuthService,
    UserService,
    TokenService,
  ],
})
export class PostModule {}
