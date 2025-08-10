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

  findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  async create(text: string): Promise<Message> {
    const newMessage = this.messagesRepository.create({ text });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }
}
