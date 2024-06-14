// init.session.ts
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { Redis } from 'ioredis';
import * as passport from 'passport';

export function setUpSession(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get('REDIS_PORT');
  const host = configService.get('REDIS_HOST');

  const RedisStore = connectRedis(session);

  const client = new Redis({
    host,
    port,
  });

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      saveUninitialized: false,
      resave: false,
      store: new RedisStore({
        client: client,
        ttl: 30,
      }),
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 30, // 쿠키 유효기간: 30분
        path: '/',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
/* import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { Redis } from 'ioredis';
import * as passport from 'passport';

export function setUpSession(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);

    app.use(
        session({
          secret: 'asasas',  // 세션에 사용될 시크릿 값. 감춰두자.
          saveUninitialized: false,
          resave: false,
        }),
      );
      app.use(passport.initialize());
      app.use(passport.session());
} */