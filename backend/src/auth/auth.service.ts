import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantsService } from '../tenants/tenants.service';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantsService: TenantsService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const tenants = await this.tenantsService.getTenantsForUser(user.id);
    const permissions = new Set<string>();
    if (user.isAdmin) {
      permissions.add('*:*');
    } else {
      user.groups?.forEach((group) => {
        group.roles?.forEach((role) => {
          role.permissions?.forEach((permission) => {
            permissions.add(permission.name);
          });
        });
      });
    }

    const payload = {
      email: user.email,
      sub: user.id,
      tenants: tenants.map((t) => ({ id: t.id, name: t.name })),
      permissions: Array.from(permissions),
      isAdmin: user.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
