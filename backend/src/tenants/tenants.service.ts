import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant.entity';
import { UserTenant } from '../user-tenant.entity';
import { RolesService } from 'src/rbac/roles.service';
import { UserRole } from 'src/user-role.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(UserTenant)
    private userTenantsRepository: Repository<UserTenant>,
    private readonly rolesService: RolesService,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
  ) {}

  async createTenant(name: string, userId: number): Promise<Tenant> {
    const tenant = this.tenantsRepository.create({ name });
    await this.tenantsRepository.save(tenant);

    const userTenant = this.userTenantsRepository.create({
      userId: userId,
      tenantId: tenant.id,
    });
    await this.userTenantsRepository.save(userTenant);

    // Create default roles for the new tenant
    const adminRole = await this.rolesService.create('Admin', tenant.id);
    await this.rolesService.create('Member', tenant.id);

    // Assign the admin role to the user who created the tenant
    const userRole = this.userRolesRepository.create({
      userId,
      roleId: adminRole.id,
    });
    await this.userRolesRepository.save(userRole);

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
