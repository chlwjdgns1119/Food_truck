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

  // 세션과 Redis를 연결해줄 객체
  const RedisStore = connectRedis(session);

  // 레디스 설정
  const client = new Redis({
    host,
    port,
  });

    app.use(
        session({
          secret: configService.get('SESSION_SECRET'),  // 세션에 사용될 시크릿 값. 감춰두자.
          saveUninitialized: false,
          resave: false,
          store: new RedisStore({  // 세션 스토어 설정. 여기서 RedisStore를 설정해서 client에 위에서 설정한 레디스를 입력하자.
            client: client,
            ttl: 30,  // time to live
          }),
          cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 30000,  //세션이 redis에 저장되는 기간은 maxAge로 조절한다.(ms)
          },
        }),
      );
      app.use(passport.initialize());
      app.use(passport.session());
}