import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // 👈 Добавь

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    AuthModule,
    UsersModule, // 👈 Подключи
  ],
})
export class AppModule {}
