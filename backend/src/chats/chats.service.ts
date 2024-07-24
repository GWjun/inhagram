import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatsModel } from './entity/chats.entity';
import { UsersModel } from '../users/entities/users.entity';

import { BasePaginationDto } from '../common/dto/base-pagination.dto';

import { CommonService } from '../common/common.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatsRepository: Repository<ChatsModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly commonService: CommonService,
  ) {}

  async paginateChats(dto: BasePaginationDto, userId: number) {
    const chatIds = await this.getChatIdsByUserId(userId);

    return this.commonService.paginate(
      dto,
      this.chatsRepository,
      {
        where: { id: In(chatIds) },
        relations: { users: true },
      },
      'chats ',
    );
  }

  async createChat(userIds: number[]) {
    const chat = await this.chatsRepository.save({
      users: userIds.map((id) => ({ id })),
    });

    return this.chatsRepository.findOne({
      where: {
        id: chat.id,
      },
    });
  }

  async checkIfChatExists(chatId: number) {
    return await this.chatsRepository.exists({
      where: {
        id: chatId,
      },
    });
  }

  async getChatIdsByUserId(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['chats'],
    });

    if (!user || !user.chats) {
      return [];
    }

    return user.chats.map((chat) => chat.id);
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
}
