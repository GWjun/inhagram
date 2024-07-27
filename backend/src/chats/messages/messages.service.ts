import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesModel } from './entity/messages.entity';
import { Repository } from 'typeorm';

import { CommonService } from '../../common/common.service';
import { ChatsService } from '../chats.service';

import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { CreateMessagesDto } from './dto/create-messages.dto';

@Injectable()
export class ChatsMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly chatsService: ChatsService,
    private readonly commonService: CommonService,
  ) {}

  async paginateMessages(
    dto: BasePaginationDto,
    userId: number,
    chatId: number,
  ) {
    const chatIds = await this.chatsService.getChatIdsByUserId(userId);
    const isExist = chatIds.includes(chatId);

    if (isExist) {
      return this.commonService.paginate(
        dto,
        this.messagesRepository,
        {
          where: { chat: { id: chatId } },
          relations: { author: true },
          select: {
            author: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
        `chats/${chatId}/messages`,
      );
    } else {
      throw new UnauthorizedException('CHAT_NOT_FOUND');
    }
  }

  async createMessage(dto: CreateMessagesDto, authorId: number) {
    const message = await this.messagesRepository.save({
      chat: { id: dto.chatId },
      author: { id: authorId },
      message: dto.message,
    });

    return this.messagesRepository.findOne({
      where: { id: message.id },
      relations: { chat: true },
    });
  }
}
