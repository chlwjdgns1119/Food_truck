import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.LOCAL_GOOGLE_LOGIN_CB, // 이 부분은 구글 콘솔에서 설정한대로. 승인된 리디렉션 URI
      scope: ['email', 'profile'],
    });
  }

  async validate(profile: any, done: VerifyCallback) {
    try {
      const { name, emails, photos } = profile;
      console.log('🚀 🔶 GoogleStrategy 🔶 validate 🔶 profile:', profile);
      const fullName = name.firstName + name.lastName;

      const user = {
        email: emails[0].value,
        name: fullName,
        photo: photos[0].value,
      };
      
      console.log('🚀 🔶 GoogleStrategy 🔶 validate 🔶 user:', user);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}