import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service'; // <-- ОБЯЗАТЕЛЬНО
import { User } from '../users/user.entity';
import { AuthModule } from '../auth/auth.module'; // <-- вот ЭТОГО не хватает у тебя

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule, // <-- именно его, чтобы получить JwtService с настроенным secret
  ],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
