import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { TenantsService } from './tenants/tenants.service';

async function seedAdminAndTenants(
  usersService: UsersService,
  tenantsService: TenantsService,
): Promise<void> {
  // Ensure admin user exists
  let adminUser = await usersService.findOne('admin@admin.com');
  if (!adminUser) {
    adminUser = await usersService.create('admin@admin.com', 'admin');
    console.log('Admin user created.');
  }

  // Ensure admin is a member of at least two tenants
  const adminTenants = await tenantsService.getTenantsForUser(adminUser.id);
  if (adminTenants.length < 2) {
    const toCreate = 2 - adminTenants.length;
    for (let i = 0; i < toCreate; i++) {
      const name = `Admin Tenant ${adminTenants.length + i + 1}`;
      await tenantsService.createTenant(name, adminUser.id);
    }
    console.log(`Seeded ${toCreate} tenant(s) for admin.`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('The API for the backend service')
  .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  // Seed the database with admin and ensure at least 2 tenants for admin
  const usersService = app.get(UsersService);
  const tenantsService = app.get(TenantsService);
  await seedAdminAndTenants(usersService, tenantsService);

  await app.listen(3001);
}
bootstrap();
