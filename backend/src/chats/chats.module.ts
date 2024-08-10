import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';

import { ChatsModel } from './entity/chats.entity';
import { UsersModel } from '../users/entity/users.entity';
import { MessagesModel } from './messages/entity/messages.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { MessagesController } from './messages/messages.controller';
import { ChatsMessagesService } from './messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel, UsersModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsService, ChatsGateway, ChatsMessagesService],
})
export class ChatsModule {}
