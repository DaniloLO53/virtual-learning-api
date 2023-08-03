import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/user/user.types';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);
