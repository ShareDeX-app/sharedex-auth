import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // 👈 для будущей DTO-валидации
  app.enableCors(); // 👈 чтобы можно было подключаться с фронта

  await app.listen(3000);
}
bootstrap();
