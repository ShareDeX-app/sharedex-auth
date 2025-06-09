// src/guest/guest.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserRole } from '../users/role.enum';
import * as bcrypt from 'bcrypt';

@Controller('guest')
export class GuestController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async registerGuest(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: UserRole.GUEST,
    });

    await this.userRepo.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);


    return { access_token, role: user.role };
  }
}
