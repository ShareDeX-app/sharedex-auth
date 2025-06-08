import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      console.log('Authenticated user:', user); // для отладки

      const { passwordHash, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role, // ВАЖНО: чтобы был доступен в RolesGuard
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
