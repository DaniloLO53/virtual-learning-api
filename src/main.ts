import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: 'COOKIE_SECRET',
      saveUninitialized: false,
      resave: false,
      name: 'CHAT_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000, // 1 day
      },
    }),
  );
  await app.listen(5000);
}
bootstrap();
