import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @Body() createGroupDto: { name: string; roles: number[] },
    @Req() req,
  ) {
    return this.groupsService.create(createGroupDto, req.tenantId);
  }

  @Get()
  findAll(@Req() req) {
    return this.groupsService.findAll(req.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.groupsService.findOne(+id, req.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: { name: string; roles: number[] },
    @Req() req,
  ) {
    return this.groupsService.update(+id, updateGroupDto, req.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.groupsService.remove(+id, req.tenantId);
  }

  @Post(':groupId/users/:userId')
  addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.groupsService.addUserToGroup(+groupId, +userId, req.tenantId);
  }

  @Delete(':groupId/users/:userId')
  removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.groupsService.removeUserFromGroup(
      +groupId,
      +userId,
      req.tenantId,
    );
  }
}
