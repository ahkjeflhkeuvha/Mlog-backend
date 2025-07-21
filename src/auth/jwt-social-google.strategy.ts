import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope: [
        configService.get('GOOGLE_SCOPE_PROFILE'),
        configService.get('GOOGLE_SCOPE_EMAIL'),
      ],
    });
  }

  // refresh token
  /*authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }*/

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const user = this.authService.validateSocialUser(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
