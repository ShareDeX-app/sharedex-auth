import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/role.enum';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperadminController {
  @Get('companies')
  getCompanies() {
    return { companies: [] };
  }

  @Get('users')
  getAllUsers() {
    return { users: [] };
  }

  @Get('stats')
  getStats() {
    return { stats: { usage: 'high', activeUsers: 42 } };
  }
}
