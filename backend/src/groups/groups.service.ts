import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from '../group.entity';
import { Role } from '../role.entity';
import { User } from '../user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(tenantId: number): Promise<Group[]> {
    return this.groupsRepository.find({
      where: { tenantId },
      relations: ['roles'],
    });
  }

  findOne(id: number, tenantId: number): Promise<Group> {
    return this.groupsRepository.findOne({
      where: { id, tenantId },
      relations: ['roles'],
    });
  }

  async create(
    groupDto: { name: string; roles: number[] },
    tenantId: number,
  ): Promise<Group> {
    const roles = await this.rolesRepository.findBy({
      id: In(groupDto.roles),
    });
    const newGroup = this.groupsRepository.create({
      name: groupDto.name,
      roles,
      tenantId,
    });
    return this.groupsRepository.save(newGroup);
  }

  async update(
    id: number,
    groupDto: { name: string; roles: number[] },
    tenantId: number,
  ): Promise<Group> {
    const roles = await this.rolesRepository.findBy({
      id: In(groupDto.roles),
    });
    await this.groupsRepository.save({
      id,
      name: groupDto.name,
      roles,
      tenantId,
    });
    return this.findOne(id, tenantId);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    await this.groupsRepository.delete({ id, tenantId });
  }

  async addUserToGroup(
    groupId: number,
    userId: number,
    tenantId: number,
  ): Promise<User> {
    const group = await this.findOne(groupId, tenantId);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });
    user.groups.push(group);
    return this.usersRepository.save(user);
  }

  async removeUserFromGroup(
    groupId: number,
    userId: number,
    tenantId: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });
    user.groups = user.groups.filter((g) => g.id !== groupId);
    return this.usersRepository.save(user);
  }
}
