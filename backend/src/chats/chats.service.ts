import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { ChatsModel } from './entity/chats.entity';
import { UsersModel } from '../users/entity/users.entity';

import { BasePaginationDto } from '../common/dto/base-pagination.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';

import { CommonService } from '../common/common.service';
import { ChatsMessagesService } from './messages/messages.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatsRepository: Repository<ChatsModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly messagesService: ChatsMessagesService,
    private readonly commonService: CommonService,
  ) {}

  async paginateChats(dto: BasePaginationDto, userId: number) {
    const chatIds = await this.getChatIdsByUserId(userId);

    return this.commonService.paginate(
      dto,
      this.chatsRepository,
      {
        where: { id: In(chatIds), users: { id: Not(userId) } },
        relations: { users: true },
        select: {
          users: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      'chats',
    );
  }

  async createChat(userIds: number[]) {
    const chat = await this.chatsRepository.save({
      users: userIds.map((id) => ({ id })),
      activeUsers: userIds.map((id) => ({ id })),
    });

    return this.chatsRepository.findOne({
      where: {
        id: chat.id,
      },
    });
  }

  async exitChat(userId: number, chatId: number) {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['activeUsers'],
    });

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!chat || !user) {
      throw new Error('Chat or User not found');
    }

    chat.activeUsers = chat.activeUsers.filter(
      (activeUser) => activeUser.id !== userId,
    );

    const message: CreateMessagesDto = {
      chatId,
      message: '상대방이 채팅방을 나갔습니다.',
    };
    await this.messagesService.createMessage(message, userId, true);

    if (chat.activeUsers.length === 0) await this.deleteChat(chat);
    else await this.chatsRepository.save(chat);
  }

  private async deleteChat(chat: ChatsModel) {
    if (chat.messages && chat.messages.message.length > 0) {
      for (const message of chat.messages.message) {
        await this.chatsRepository.manager.remove(message);
      }
    }

    await this.chatsRepository.remove(chat);
  }

  async getChatIdsByUserId(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['activeChats'],
    });

    if (!user || !user.activeChats) {
      return [];
    }

    return user.activeChats.map((chat) => chat.id);
  }

  async getCommonChatIdByUserIds(userId1: number, userId2: number) {
    const chatIds1 = await this.getChatIdsByUserId(userId1);
    if (chatIds1.length === 0) return null;

    const chatIds2 = await this.getChatIdsByUserId(userId2);
    if (chatIds2.length === 0) return null;

    const commonChatIds = chatIds1.filter((chatId) =>
      chatIds2.includes(chatId),
    );

    return commonChatIds.length > 0 ? commonChatIds[0] : null;
  }

  async getUserByChatId(userId: number, chatId: number) {
    const chatIds = await this.getChatIdsByUserId(userId);
    if (chatIds.length === 0) return null;
    if (!chatIds.includes(chatId)) throw new UnauthorizedException('Not Found');

    const chat = await this.chatsRepository.findOne({
      where: { id: chatId, users: { id: Not(userId) } },
      relations: { users: true },
      select: {
        users: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    });

    return chat.users[0];
  }
}
