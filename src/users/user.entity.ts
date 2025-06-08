// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: () => 'NOW()' })
  createdAt: Date;

 // user.entity.ts
@Column({ default: 'user' })
role: string; // или enum Role

}
