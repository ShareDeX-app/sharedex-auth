// src/auth/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // guest / user / admin / superadmin
}
