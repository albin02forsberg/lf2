import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new ForbiddenException('X-Tenant-ID header is missing');
    }

    const tenantIdNum = parseInt(tenantId, 10);
    if (isNaN(tenantIdNum)) {
      throw new ForbiddenException('Invalid X-Tenant-ID header');
    }

    const hasTenantAccess = user.tenants.some((tenant) => tenant.id === tenantIdNum);

    if (!hasTenantAccess) {
      throw new ForbiddenException('You do not have access to this tenant');
    }

    return true;
  }
}
