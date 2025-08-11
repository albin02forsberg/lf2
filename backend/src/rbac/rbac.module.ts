import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission.entity';
import { Role } from '../role.entity';
import { Group } from '../group.entity';
import { RolePermission } from '../role-permission.entity';
import { UserRole } from '../user-role.entity';
import { GroupRole } from '../group-role.entity';
import { UserGroup } from '../user-group.entity';
import { PermissionsService } from './permissions.service';
import { RolesService } from './roles.service';
import { GroupsService } from './groups.service';
import { PermissionsController } from './permissions.controller';
import { RolesController } from './roles.controller';
import { GroupsController } from './groups.controller';
import { User } from '../user.entity';
import { RbacService } from './rbac.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      Role,
      Group,
      RolePermission,
      UserRole,
      GroupRole,
      UserGroup,
      User,
    ]),
  ],
  providers: [PermissionsService, RolesService, GroupsService, RbacService],
  controllers: [PermissionsController, RolesController, GroupsController],
  exports: [PermissionsService, RolesService, GroupsService, RbacService],
})
export class RbacModule {}
