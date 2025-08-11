import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

@Entity('user_tenants')
export class UserTenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tenantId: number;

  @ManyToOne(() => User, (user) => user.userTenants)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.userTenants)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
