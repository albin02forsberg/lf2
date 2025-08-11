import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantsService } from '../tenants/tenants.service';
import { RbacService } from 'src/rbac/rbac.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantsService: TenantsService,
    private rbacService: RbacService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const tenants = await this.tenantsService.getTenantsForUser(user.id);
    const permissionsByTenant: { [tenantId: number]: string[] } = {};
    for (const tenant of tenants) {
      permissionsByTenant[tenant.id] =
        await this.rbacService.getPermissionsForUserInTenant(
          user.id,
          tenant.id,
        );
    }
    const payload = {
      email: user.email,
      sub: user.id,
      is_superadmin: user.is_superadmin,
      tenants: tenants.map((t) => ({ id: t.id, name: t.name })),
      permissionsByTenant,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
