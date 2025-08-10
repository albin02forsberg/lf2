import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from './message.entity';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('messages')
  findAll(): Promise<Message[]> {
    return this.appService.findAll();
  }

  @Post('messages')
  create(@Body() body: { text: string }): Promise<Message> {
    return this.appService.create(body.text);
  }
}
