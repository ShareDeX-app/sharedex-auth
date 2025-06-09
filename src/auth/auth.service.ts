// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
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

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Неверный пароль');

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  async register(dto: CreateUserDto, currentUser?: User): Promise<User> {
    // Ограничение: только админ может создать админа
    if (dto.role === UserRole.ADMIN && (!currentUser || currentUser.role !== UserRole.ADMIN)) {
      throw new ForbiddenException('Только админ может назначить другого админа');
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      password,
      role: dto.role || UserRole.USER,
    });

    return await this.userRepo.save(user);
  }
}
