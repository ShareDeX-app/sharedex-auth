import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  @Get('users')
  getAllUsers() {
    return { users: [] };
  }

  @Post('users/invite')
  inviteUser(@Body() body: any) {
    return { message: 'Пользователь приглашён', data: body };
  }

  @Get('rooms')
  getRooms() {
    return { rooms: [] };
  }

  @Post('rooms')
  createRoom(@Body() body: any) {
    return { message: 'Помещение добавлено', data: body };
  }

  @Get('bookings/all')
  getAllBookings() {
    return { bookings: [] };
  }
}
