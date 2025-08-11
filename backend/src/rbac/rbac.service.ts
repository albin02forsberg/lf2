import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { PermissionsService } from './permissions.service';

@Injectable()
export class RbacService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async onModuleInit() {
    const permissions = [
      'users:view',
      'users:edit',
      'roles:view',
      'roles:create',
      'roles:edit',
      'roles:delete',
      'groups:view',
      'groups:create',
      'groups:edit',
      'groups:delete',
      'messages:create',
      'messages:view',
      'settings:view',
    ];

    for (const name of permissions) {
      const existing = await this.permissionsService.findOneByName(name);
      if (!existing) {
        await this.permissionsService.create(name);
      }
    }
  }

  async getPermissionsForUserInTenant(
    userId: number,
    tenantId: number,
  ): Promise<string[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
        'userGroups',
        'userGroups.group',
        'userGroups.group.groupRoles',
        'userGroups.group.groupRoles.role',
        'userGroups.group.groupRoles.role.rolePermissions',
        'userGroups.group.groupRoles.role.rolePermissions.permission',
      ],
    });

    if (!user) {
      return [];
    }

    const permissions = new Set<string>();

    // Permissions from roles directly assigned to the user
    user.userRoles
      .filter((userRole) => userRole.role.tenantId === tenantId)
      .forEach((userRole) => {
        userRole.role.rolePermissions.forEach((rp) => {
          permissions.add(rp.permission.name);
        });
      });

    // Permissions from roles assigned to the user's groups
    user.userGroups
      .filter((userGroup) => userGroup.group.tenantId === tenantId)
      .forEach((userGroup) => {
        userGroup.group.groupRoles.forEach((groupRole) => {
          groupRole.role.rolePermissions.forEach((rp) => {
            permissions.add(rp.permission.name);
          });
        });
      });

    return Array.from(permissions);
  }
}
