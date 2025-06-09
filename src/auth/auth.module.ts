import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { User } from '../users/user.entity';

@Module({
imports: [
  TypeOrmModule.forFeature([User]),
  ConfigModule, // <- без .forRoot(), это важно!
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
],

  controllers: [AuthController],
 providers: [
  AuthService,
  JwtStrategy,
  GoogleStrategy,
  ConfigService, // <== добавь явно сюда (временами это нужно)
],
  exports: [AuthService, JwtModule], // важно экспортировать JwtModule, если его юзаешь в guest
})
export class AuthModule {}
