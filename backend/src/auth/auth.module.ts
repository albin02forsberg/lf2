import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TenantsModule } from '../tenants/tenants.module';
import { RbacModule } from '../rbac/rbac.module';
import { TenantGuard } from './tenant.guard';

@Module({
  imports: [
    UsersModule,
    TenantsModule,
    PassportModule,
    RbacModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET', // TODO: move to config
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, TenantGuard],
  controllers: [AuthController],
})
export class AuthModule {}
