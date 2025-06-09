import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../users/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ email });

    console.log('🔍 Найден пользователь:', user);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('🔐 Введённый пароль:', password);
    console.log('🧂 Хеш из БД:', user.password);
    console.log('✅ Пароль валиден:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      role: user.role,
    };
  }

  async register(dto: CreateUserDto, currentUser?: User) {
    // Если передан текущий пользователь (admin) — проверим права
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can register new users');
    }

    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role || UserRole.USER, // по умолчанию обычный пользователь
    });

    return this.userRepo.save(newUser);
  }
}
