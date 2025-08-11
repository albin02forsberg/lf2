import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  groupId: number;

  @ManyToOne(() => User, (user) => user.userGroups)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  @JoinColumn({ name: 'groupId' })
  group: Group;
}
