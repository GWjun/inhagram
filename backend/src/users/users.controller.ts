import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { User } from './decorator/user.decorator';
import { UsersModel } from './entity/users.entity';

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

  @Get(':nickname/count')
  async getUserCount(@Param('nickname') nickname: string) {
    return await this.usersService.getUserCount(nickname);
  }

  @Get('search')
  searchUsers(@Query('name') nickname: string) {
    return this.usersService.searchUsersByName(nickname);
  }

  @Get('follow/check/:id')
  @UseGuards(AccessTokenGuard)
  async getIsFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    return await this.usersService.getIsFollowing(user.id, followeeId);
  }

  @Get('follow/:id')
  async getFollow(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getFollowers(userId);
  }

  @Post('follow/:id')
  @UseGuards(AccessTokenGuard)
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.followUser(user.id, followeeId);

    return true;
  }

  @Delete('follow/:id')
  @UseGuards(AccessTokenGuard)
  async deleteFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.deleteFollower(user.id, followeeId);
    return true;
  }
}
