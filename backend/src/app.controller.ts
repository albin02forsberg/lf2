import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from './message.entity';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('api/messages')
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(): Promise<Message[]> {
    return this.appService.findAll();
  }

  @Post()
  create(@Body() body: { text: string }): Promise<Message> {
    return this.appService.create(body.text);
  }
}
