import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string; // e.g., 'create:user', 'read:messages'
}
