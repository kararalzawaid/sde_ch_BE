import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthGuard } from '@security/guards/auth.guard';

import { UsersModule } from '@users/users.modules';
import { DatabaseModule } from '@database/database.module';
import { SecurityModule } from '@security/security.module';
import { MessagesModule } from '@messages/messages.module';
import { CommonModule } from '@common/common.module';
import { AppController } from './app.controller';

// https://docs.nestjs.com/security/authentication
// i inspired from this guide to create this global guard
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    UsersModule,
    SecurityModule,
    MessagesModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
