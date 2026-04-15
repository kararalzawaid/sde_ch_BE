import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';

// i'm not fun typeorm but i made this doc cause it is the easiest way to get started with nestjs and typeorm for the assessment
// https://docs.nestjs.com/techniques/database
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig())]
})
export class DatabaseModule {}
