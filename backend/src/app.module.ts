import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import { UserTenant } from './user-tenant.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
  // When running the backend locally (outside Docker), use localhost;
  // override with POSTGRES_HOST=db if running the backend in Docker Compose.
  host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest',
      entities: [Message, User, Tenant, UserTenant],
      synchronize: true, // TODO: disable in production
    }),
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    UsersModule,
    TenantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
