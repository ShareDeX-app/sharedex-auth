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
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecret', // fallback на всякий
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден или удалён');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role, // 🔥 обязательно для @RolesGuard
    };
  }
}
