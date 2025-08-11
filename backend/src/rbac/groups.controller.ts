import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { CreateGroupDto } from './dto/create-group.dto';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Req() req) {
    return this.groupsService.create(createGroupDto.name, req.tenantId);
  }

  @Get()
  findAll(@Req() req) {
    return this.groupsService.findAll(req.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.groupsService.findOne(+id, req.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.groupsService.remove(+id, req.tenantId);
  }

  @Post(':groupId/users/:userId')
  addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupsService.addUserToGroup(+userId, +groupId);
  }

  @Delete(':groupId/users/:userId')
  removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId:string,
  ) {
    return this.groupsService.removeUserFromGroup(+userId, +groupId);
  }

  @Post(':groupId/roles/:roleId')
  addRoleToGroup(
    @Param('groupId') groupId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.groupsService.addRoleToGroup(+roleId, +groupId);
  }

  @Delete(':groupId/roles/:roleId')
  removeRoleFromGroup(
    @Param('groupId') groupId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.groupsService.removeRoleFromGroup(+roleId, +groupId);
  }

  @Post('/users/:userId/roles/:roleId')
  assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.groupsService.assignRoleToUser(+userId, +roleId);
  }

  @Delete('/users/:userId/roles/:roleId')
  removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.groupsService.removeRoleFromUser(+userId, +roleId);
  }

  @Patch('/users/:userId/roles/:roleId')
  changeUserRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @Req() req,
  ) {
    return this.groupsService.changeUserRole(+userId, +roleId, req.tenantId);
  }
}
