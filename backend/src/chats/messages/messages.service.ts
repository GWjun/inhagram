import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesModel } from './entity/messages.entity';
import { Repository } from 'typeorm';

import { CommonService } from '../../common/common.service';
import { ChatsService } from '../chats.service';

import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { CreateMessagesDto } from './dto/create-messages.dto';
import { DEFAULT_USER_SELECT_OPTIONS } from '../../users/const/default-user-select-options.const';

@Injectable()
export class ChatsMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    @Inject(forwardRef(() => ChatsService))
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
            author: DEFAULT_USER_SELECT_OPTIONS,
          },
        },
        `chats/${chatId}/messages`,
      );
    } else {
      throw new UnauthorizedException('CHAT_NOT_FOUND');
    }
  }

  async createMessage(
    dto: CreateMessagesDto,
    authorId: number,
    notice?: boolean,
  ) {
    const message = await this.messagesRepository.save({
      chat: { id: dto.chatId },
      author: { id: authorId },
      message: dto.message,
      notice,
    });

    return this.messagesRepository.findOne({
      where: { id: message.id },
      relations: { chat: true },
    });
  }
}
