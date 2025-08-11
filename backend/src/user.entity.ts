import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserTenant } from './user-tenant.entity';
import { Group } from './group.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => UserTenant, (userTenant) => userTenant.user)
  userTenants: UserTenant[];

  @ManyToMany(() => Group, { cascade: true, eager: true })
  @JoinTable({
    name: 'user_groups',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'groupId', referencedColumnName: 'id' },
  })
  groups: Group[];
}
