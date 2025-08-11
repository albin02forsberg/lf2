import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant.entity';
import { UserTenant } from '../user-tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(UserTenant)
    private userTenantsRepository: Repository<UserTenant>,
  ) {}

  async createTenant(name: string, userId: number): Promise<Tenant> {
    const tenant = this.tenantsRepository.create({ name });
    await this.tenantsRepository.save(tenant);

    const userTenant = this.userTenantsRepository.create({
      userId: userId,
      tenantId: tenant.id,
    });
    await this.userTenantsRepository.save(userTenant);

    return tenant;
  }

  async getTenantsForUser(userId: number): Promise<Tenant[]> {
    const userTenants = await this.userTenantsRepository.find({
      where: { userId },
      relations: ['tenant'],
    });
    return userTenants.map((ut) => ut.tenant);
  }
}
