import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  findOne(id: number): Promise<Permission> {
    return this.permissionsRepository.findOne({ where: { id } });
  }

  create(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = this.permissionsRepository.create(permission);
    return this.permissionsRepository.save(newPermission);
  }

  async update(id: number, permission: Partial<Permission>): Promise<Permission> {
    await this.permissionsRepository.update(id, permission);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.permissionsRepository.delete(id);
  }
}
