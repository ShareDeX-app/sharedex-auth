// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
