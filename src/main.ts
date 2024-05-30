import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const FileStoreSession = FileStore(session);

  app.use(  
    session({
      store: new FileStoreSession({
        path: '/workspaces/Food_truck/sessions', // 세션 파일이 저장될 디렉토리를 지정합니다.
      }),
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();



