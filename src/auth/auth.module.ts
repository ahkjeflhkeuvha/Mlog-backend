import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from './jwt-social-google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { TokenModule } from 'src/token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    TokenModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
