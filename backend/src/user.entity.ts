import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserTenant } from './user-tenant.entity';
import { UserRole } from './user-role.entity';
import { UserGroup } from './user-group.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  is_superadmin: boolean;

  @OneToMany(() => UserTenant, (userTenant) => userTenant.user)
  userTenants: UserTenant[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];
}
