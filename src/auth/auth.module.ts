import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity';
import { ConfigModule } from '@nestjs/config'; // ← вот это

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    ConfigModule, // ← вот это обязательно
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
