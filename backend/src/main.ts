import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Seed the database with an admin user
  const usersService = app.get(UsersService);
  const adminUser = await usersService.findOne('admin@admin.com');
  if (!adminUser) {
    await usersService.create('admin@admin.com', 'admin');
    console.log('Admin user created.');
  }

  await app.listen(3001);
}
bootstrap();
