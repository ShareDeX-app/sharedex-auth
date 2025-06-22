import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const expressApp = app.getHttpAdapter().getInstance();

  // 🛣️ Лог всех маршрутов (если Express адаптер)
  try {
    console.log('\n🛣 Registered Routes:\n');
    expressApp._router.stack
      .filter((layer) => layer.route)
      .forEach((layer) => {
        const method = Object.keys(layer.route.methods)[0]?.toUpperCase();
        const path = layer.route.path;
        console.log(`📍 [${method}] ${path}`);
      });
    console.log('\n');
  } catch (err) {
    console.warn('❗ Could not read Express router stack. Check adapter.');
  }

  // ⚛️ Отдаём React статику
  const reactPath = join(__dirname, '..', '..', 'sharedex-app', 'build');
  expressApp.use(express.static(reactPath));
  expressApp.get('*', (_, res) => {
    res.sendFile(join(reactPath, 'index.html'));
  });

  await app.listen(3000);
  Logger.log('✅ Server running on http://localhost:3000');
}

bootstrap();
