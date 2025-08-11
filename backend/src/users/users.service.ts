import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [
        'groups',
        'groups.roles',
        'groups.roles.permissions',
        'userTenants',
        'userTenants.tenant',
      ],
    });
    return user ?? undefined;
  }

  async create(email: string, password_plaintext: string): Promise<User> {
    const salt_rounds = 10;
    const password_hash = await bcrypt.hash(password_plaintext, salt_rounds);
    const user = this.usersRepository.create({ email, password_hash });
    return this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
