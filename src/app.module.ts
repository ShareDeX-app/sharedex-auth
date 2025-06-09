import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { GuestModule } from './guest/guest.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity'; // обязательно!

@Module({
  imports: [ GuestModule, UserModule, AdminModule, SuperadminModule,
    ConfigModule.forRoot(), // для .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'sharedex',
      entities: [User], // или [__dirname + '/**/*.entity{.ts,.js}']
      synchronize: true, // В dev-режиме: да. В prod: обязательно false!
    }),
    AuthModule,
    GuestModule,
    UserModule,
    AdminModule,
    SuperadminModule,
  ],
})
export class AppModule {}
