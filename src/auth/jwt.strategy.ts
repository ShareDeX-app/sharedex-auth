import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // ← 👈 важно: присвоили userRepo
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException(); // ← 👈 не забудь импорт сверху
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role, // 🔥 ОБЯЗАТЕЛЬНО ДЛЯ RolesGuard
    };
  }
}
