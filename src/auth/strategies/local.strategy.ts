import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'userid',
      passwordField: 'password',
    });
  }

  async validate(
    userid: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    const user = await this.authService.loginUser(
      userid, password
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return done(null, user);
  }
}