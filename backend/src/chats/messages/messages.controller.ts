import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatsMessagesService } from './messages.service';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';

import { AccessTokenGuard } from '../../auth/guard/bearer-token.guard';
import { User } from '../../users/decorator/user.decorator';

@Controller('chats/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: ChatsMessagesService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  paginateMessage(
    @User('id') userId: number,
    @Param('cid', ParseIntPipe) chatId: number,
    @Query() dto: BasePaginationDto,
  ) {
    return this.messagesService.paginateMessages(dto, userId, chatId);
  }
}
