/* // local.strategy.ts
import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    const user = await this.authService.validateUser({
      email: email,
      password: password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return done(null, user);
  }
} */

  // local.strategy.ts
import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    id: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    const user = await this.authService.loginUser(
      id, password
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return done(null, user);
  }
}