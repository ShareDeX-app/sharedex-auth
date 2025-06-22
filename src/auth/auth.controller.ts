import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Get,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );
    return this.authService.login(user); // возвращает access_token
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  async register(
    @Body() dto: CreateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can register other admins.');
    }

    return this.authService.register(dto, currentUser);
  }


  /*
  // Google OAuth 
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Google редирект
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // ⚠️ Заменим это позже на выдачу токена
    return {
      message: 'Google login successful',
      user: req.user,
    };
    */
@Get('test')
public getTest() {
  return { message: 'auth controller is alive' };
}

 }
