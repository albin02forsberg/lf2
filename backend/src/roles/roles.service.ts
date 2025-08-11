import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../role.entity';
import { Permission } from '../permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['permissions'] });
  }

  findOne(id: number): Promise<Role> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async create(roleDto: { name: string; permissions: number[] }): Promise<Role> {
    const permissions = await this.permissionsRepository.findBy({
      id: In(roleDto.permissions),
    });
    const newRole = this.rolesRepository.create({
      name: roleDto.name,
      permissions,
    });
    return this.rolesRepository.save(newRole);
  }

  async update(
    id: number,
    roleDto: { name: string; permissions: number[] },
  ): Promise<Role> {
    const permissions = await this.permissionsRepository.findBy({
      id: In(roleDto.permissions),
    });
    await this.rolesRepository.save({
      id,
      name: roleDto.name,
      permissions,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
