import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserTenant } from './user-tenant.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserTenant, (userTenant) => userTenant.tenant)
  userTenants: UserTenant[];
}
