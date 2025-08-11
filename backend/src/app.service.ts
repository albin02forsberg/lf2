import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  findAll(tenantId: number): Promise<Message[]> {
    return this.messagesRepository.find({ where: { tenantId } });
  }

  async create(text: string, tenantId: number): Promise<Message> {
    const newMessage = this.messagesRepository.create({ text, tenantId });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }
}
