import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user, tenantId } = context.switchToHttp().getRequest();

    if (user.is_superadmin) {
      return true;
    }

    if (
      !tenantId ||
      !user.permissionsByTenant ||
      !user.permissionsByTenant[tenantId]
    ) {
      return false;
    }

    const userPermissions = user.permissionsByTenant[tenantId];

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
