import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/role.enum';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class UserController {
  @Get('bookings')
  getMyBookings() {
    return { bookings: [] };
  }

  @Post('book')
  createBooking(@Body() body: any) {
    return { message: 'Бронирование создано', data: body };
  }

  @Get('profile')
  getProfile() {
    return { name: 'Тестовый пользователь', role: UserRole.USER };
  }
}
