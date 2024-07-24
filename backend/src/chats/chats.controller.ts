import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { BasePaginationDto } from '../common/dto/base-pagination.dto';

import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { User } from '../users/decorator/user.decorator';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  paginateChat(@User('id') userId: number, @Query() dto: BasePaginationDto) {
    return this.chatsService.paginateChats(dto, userId);
  }
}
