// src/auth/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
