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
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(email: string, password_plaintext: string): Promise<User> {
    const salt_rounds = 10;
    const password_hash = await bcrypt.hash(password_plaintext, salt_rounds);
    const user = this.usersRepository.create({ email, password_hash });
    return this.usersRepository.save(user);
  }
}
