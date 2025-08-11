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

  findOne(id: number): Promise<Permission | null> {
    return this.permissionsRepository.findOneBy({ id });
  }

  findOneByName(name: string): Promise<Permission | null> {
    return this.permissionsRepository.findOneBy({ name });
  }

  create(name: string): Promise<Permission> {
    const permission = this.permissionsRepository.create({ name });
    return this.permissionsRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    await this.permissionsRepository.delete(id);
  }
}
