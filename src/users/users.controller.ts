// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './role.enum'; // проверь правильность пути!

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  @Get()
  @Roles(Role.Admin) // ✅ используем enum, не строку
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}
