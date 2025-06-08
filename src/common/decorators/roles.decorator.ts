import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const ROLES_KEY = 'roles';
