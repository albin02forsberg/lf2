import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest',
      entities: [Message, User],
      synchronize: true, // TODO: disable in production
    }),
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
