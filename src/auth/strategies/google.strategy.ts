import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleLoginInfo } from '../dto/google-loginInfo.dto';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
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
      console.log(name)
      const fullName = name.firstName+ name.lastName;

      const userData: GoogleLoginInfo = {
        email: emails[0].value,
        name: fullName,
        provider,
      };
      
      console.log('🚀 🔶 GoogleStrategy 🔶 validate 🔶 user:', userData);
      
      return done(null, userData);
  }
}