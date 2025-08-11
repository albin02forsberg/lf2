import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateTenantDto {
  name: string;
}

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTenantDto: CreateTenantDto, @Request() req) {
    return this.tenantsService.createTenant(createTenantDto.name, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTenants(@Request() req) {
    return this.tenantsService.getTenantsForUser(req.user.userId);
  }
}
