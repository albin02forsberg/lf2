import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../tenant.entity';
import { UserTenant } from '../user-tenant.entity';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { RbacModule } from 'src/rbac/rbac.module';
import { UserRole } from 'src/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, UserTenant, UserRole]),
    RbacModule,
  ],
  providers: [TenantsService],
  controllers: [TenantsController],
  exports: [TenantsService],
})
export class TenantsModule {}
