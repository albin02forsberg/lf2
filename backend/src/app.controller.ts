import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from './message.entity';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TenantGuard } from './auth/tenant.guard';

@Controller('api/messages')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string): Promise<Message[]> {
    return this.appService.findAll(+tenantId);
  }

  @Post()
  create(
    @Body() body: { text: string },
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<Message> {
    return this.appService.create(body.text, +tenantId);
  }
}
