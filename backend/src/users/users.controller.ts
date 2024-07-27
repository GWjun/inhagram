import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { User } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getUsers(@User('id') userId: number) {
    return this.usersService.getRandomUsers(userId);
  }

  @Get(':nickname/id')
  async getUserId(@Param('nickname') nickname: string) {
    const userId = await this.usersService.getIdByNickname(nickname);

    if (userId) return true;
  }

  @Get(':nickname/image')
  async getUserImage(@Param('nickname') nickname: string) {
    return await this.usersService.getImageUrlByNickname(nickname);
  }

  @Get('search')
  searchUsers(@Query('name') nickname: string) {
    return this.usersService.searchUsersByName(nickname);
  }
}
