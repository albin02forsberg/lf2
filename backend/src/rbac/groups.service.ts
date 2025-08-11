import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../group.entity';
import { UserGroup } from '../user-group.entity';
import { GroupRole } from '../group-role.entity';
import { UserRole } from '../user-role.entity';
import { User } from '../user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(UserGroup)
    private userGroupsRepository: Repository<UserGroup>,
    @InjectRepository(GroupRole)
    private groupRolesRepository: Repository<GroupRole>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(tenantId: number): Promise<Group[]> {
    return this.groupsRepository.find({ where: { tenantId } });
  }

  findOne(id: number, tenantId: number): Promise<Group | null> {
    return this.groupsRepository.findOneBy({ id, tenantId });
  }

  create(name: string, tenantId: number): Promise<Group> {
    const group = this.groupsRepository.create({ name, tenantId });
    return this.groupsRepository.save(group);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    await this.groupsRepository.delete({ id, tenantId });
  }

  async addUserToGroup(userId: number, groupId: number): Promise<UserGroup> {
    const userGroup = this.userGroupsRepository.create({ userId, groupId });
    return this.userGroupsRepository.save(userGroup);
  }

  async removeUserFromGroup(userId: number, groupId: number): Promise<void> {
    await this.userGroupsRepository.delete({ userId, groupId });
  }

  async addRoleToGroup(roleId: number, groupId: number): Promise<GroupRole> {
    const groupRole = this.groupRolesRepository.create({ roleId, groupId });
    return this.groupRolesRepository.save(groupRole);
  }

  async removeRoleFromGroup(roleId: number, groupId: number): Promise<void> {
    await this.groupRolesRepository.delete({ roleId, groupId });
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {
    const userRole = this.userRolesRepository.create({ userId, roleId });
    return this.userRolesRepository.save(userRole);
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.userRolesRepository.delete({ userId, roleId });
  }

  async changeUserRole(
    userId: number,
    roleId: number,
    tenantId: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    // Filter out roles that belong to the current tenant
    const rolesForCurrentTenant = user.userRoles.filter(
      (userRole) => userRole.role.tenantId === tenantId,
    );

    // Remove roles from the join table that belong to the current tenant
    if (rolesForCurrentTenant.length > 0) {
      await this.userRolesRepository.remove(rolesForCurrentTenant);
    }

    // Create a new user role
    const newUserRole = this.userRolesRepository.create({
      userId,
      roleId,
    });
    await this.userRolesRepository.save(newUserRole);

    const updatedUser = await this.usersRepository.findOneOrFail({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    return updatedUser;
  }
}
