import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModel } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
