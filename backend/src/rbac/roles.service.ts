import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { RolePermission } from '../role-permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  findAll(tenantId: number): Promise<Role[]> {
    return this.rolesRepository.find({ where: { tenantId } });
  }

  findOne(id: number, tenantId: number): Promise<Role | null> {
    return this.rolesRepository.findOneBy({ id, tenantId });
  }

  create(name: string, tenantId: number): Promise<Role> {
    const role = this.rolesRepository.create({ name, tenantId });
    return this.rolesRepository.save(role);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    await this.rolesRepository.delete({ id, tenantId });
  }

  async addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    const rolePermission = this.rolePermissionsRepository.create({ roleId, permissionId });
    return this.rolePermissionsRepository.save(rolePermission);
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await this.rolePermissionsRepository.delete({ roleId, permissionId });
  }
}
