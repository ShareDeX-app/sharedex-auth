import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// 👇 если ты в src/common/guards/roles.guard.ts
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/role.enum';



@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No user in request');

    if (!requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
