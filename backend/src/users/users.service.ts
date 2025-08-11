import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';
import { UserTenant } from '../user-tenant.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserTenant)
    private userTenantsRepository: Repository<UserTenant>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async create(email: string, password_plaintext: string): Promise<User> {
    const salt_rounds = 10;
    const password_hash = await bcrypt.hash(password_plaintext, salt_rounds);
    const user = this.usersRepository.create({ email, password_hash });
    return this.usersRepository.save(user);
  }

  async findAllInTenant(tenantId: number): Promise<User[]> {
    const userTenants = await this.userTenantsRepository.find({
      where: { tenantId },
      relations: ['user', 'user.userRoles', 'user.userRoles.role'],
    });
    return userTenants
      .map((ut) => ut.user)
      .filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.id === user.id),
      );
  }
}
