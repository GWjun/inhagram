import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
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
}
