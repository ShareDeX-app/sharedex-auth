// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ email });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role, // 👈 это обязательно
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto, currentUser?: User): Promise<User> {
    // ⛔ Только админ может создать админа
    if (dto.role === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      throw new ForbiddenException('Only admins can assign admin role');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      role: dto.role || 'user', // 🔒 fallback на "user"
    });

    return this.userRepo.save(user);
  }
}
