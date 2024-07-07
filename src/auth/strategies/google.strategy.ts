import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.LOCAL_GOOGLE_LOGIN_CB, // 이 부분은 구글 콘솔에서 설정한대로. 승인된 리디렉션 URI
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {

      const { name, emails, provider } = profile;
      console.log('🚀 🔶 GoogleStrategy 🔶 validate 🔶 profile:', profile);
      const fullName = name.familyName+ name.givenName;

      const userData = {
        email: emails[0].value,
        name: fullName,
        provider,
      };
      
      console.log('🚀 🔶 GoogleStrategy 🔶 validate 🔶 user:', userData);

      // 그냥 strategy에서 로그인 처리하기로 했음. 인프런 보니 없는 계정 로그인 하려고 할 때 그냥 회원가입시키는거보고 따라하기로 했음.
      try {
        const user = await this.authService.googleLoginOrRegister(userData);
        console.log(user,"strategy");
        done(null, user);
      } catch (err) {
        done(err, false);
      }
  }
}