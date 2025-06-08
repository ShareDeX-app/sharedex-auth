import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/role.enum';

@Controller('guest')
export class GuestController {
  @Get('demo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GUEST)
  getDemo() {
    return { message: 'Добро пожаловать в демо-режим ShareDeX!' };
  }

  @Post('request-token')
  requestToken(@Body() body: { email: string }) {
    return { message: `Гостевой доступ отправлен на ${body.email}` };
  }
}
