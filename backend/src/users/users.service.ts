import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find({ select: ['nickname', 'image'] });
  }

  async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    const nicknameExists = await this.usersRepository.exists({
      where: { nickname: user.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException('Already exist nickname');
    }

    const emailExists = await this.usersRepository.exists({
      where: { email: user.email },
    });

    if (emailExists) {
      throw new BadRequestException('Already exist nickname');
    }

    const userObj = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    const newUser = await this.usersRepository.save(userObj);

    return newUser;
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async getIdByNickname(nickname: string) {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });

    if (!user) {
      throw new BadRequestException(
        `User with nickname '${nickname}' not found.`,
      );
    }

    return user.id;
  }

  async getImageUrlByNickname(nickname: string) {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });

    if (!user) {
      throw new BadRequestException(
        `User with nickname '${nickname}' not found.`,
      );
    }

    return { path: user.image };
  }

  async searchUsersByName(nickname: string) {
    if (!nickname) return [];

    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.nickname', 'user.image'])
      .where('user.nickname LIKE :nickname', { nickname: `${nickname}%` })
      .getMany();
  }
}
