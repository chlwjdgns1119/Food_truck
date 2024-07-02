import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport'
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { setUpSession } from './setting/session/init-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  setUpSession(app);

  await app.listen(3000);
}
bootstrap();



