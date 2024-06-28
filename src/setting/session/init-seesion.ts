// setting/session/init.session.ts
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';

const RedisStore = require('connect-redis').default;
const redis = require('ioredis');


export function setUpSession(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);

/*   const port = configService.get('REDIS_PORT');
  const host = configService.get('REDIS_HOST'); */

  const redisClient = new redis({
    host: "food-truck-session.yp3zmp.ng.0001.apn2.cache.amazonaws.com",
    port: 6379,
  });

  // 세션과 Redis를 연결해줄 객체
  const redisStore = new RedisStore({
    client: redisClient,
    ttl: 30,
  });

    app.use(
        session({
          secret: configService.get('SESSION_SECRET'),  // 세션에 사용될 시크릿 값. 감춰두자.
          saveUninitialized: false,
          resave: false,
          store: redisStore,
          cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 30,  //세션이 redis에 저장되는 기간은 maxAge로 조절한다.(ms)
            path: '/', // 서버에서 클라이언트한테 쿠키를 보낼 때 어떤 경로 아래에서 보낼지 말지 결정함.
          },
        }),
      );
      app.use(passport.initialize());
      app.use(passport.session());
}