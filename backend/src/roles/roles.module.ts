import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from '../role.entity';
import { Permission } from '../permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
