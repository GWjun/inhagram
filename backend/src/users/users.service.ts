import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UsersModel } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find({ select: ['nickname', 'image'] });
  }

  async getRandomUsers(userId: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.nickname', 'user.image'])
      .where('user.id != :userId', { userId })
      .orderBy('RANDOM()')
      .limit(5)
      .getMany();
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

    return {
      id: user.id,
      path: user.image,
    };
  }

  async getUserCount(nickname: string) {
    const user = await this.usersRepository.findOne({
      where: { nickname },
      relations: { posts: true },
    });

    if (!user) {
      throw new BadRequestException(
        `User with nickname '${nickname}' not found.`,
      );
    }

    return {
      postCount: user.posts.length,
      followerCount: user.followerCount,
      followeeCount: user.followeeCount,
    };
  }

  async searchUsersByName(nickname: string) {
    if (!nickname) return [];

    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.nickname', 'user.image'])
      .where('user.nickname LIKE :nickname', { nickname: `${nickname}%` })
      .getMany();
  }

  async getIsFollowing(userId: number, followeeId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { followees: true },
    });

    if (!user) {
      throw new BadRequestException(`User not found.`);
    }

    return user.followees.some((followee) => followee.id === followeeId);
  }

  async getFollowers(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { followers: true },
    });

    return user.followers;
  }

  async followUser(followerId: number, followeeId: number) {
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: { followees: true },
    });

    const followee = await this.usersRepository.findOne({
      where: { id: followeeId },
      relations: { followers: true },
    });

    if (!follower || !followee) {
      throw new BadRequestException(`User not found.`);
    }

    follower.followees.push(followee);
    follower.followeeCount += 1;

    followee.followers.push(follower);
    followee.followerCount += 1;

    await this.usersRepository.save(follower);
    await this.usersRepository.save(followee);

    return true;
  }

  async deleteFollower(userId: number, followeeId: number) {
    const follower = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        followees: true,
      },
    });

    const followee = await this.usersRepository.findOne({
      where: { id: followeeId },
      relations: {
        followers: true,
      },
    });

    if (!follower || !followee) {
      throw new BadRequestException(`User not found.`);
    }

    follower.followees = follower.followees.filter((f) => f.id !== followeeId);
    follower.followeeCount -= 1;

    followee.followers = followee.followers.filter((f) => f.id !== userId);
    followee.followerCount -= 1;

    await this.usersRepository.save(follower);
    await this.usersRepository.save(followee);

    return true;
  }
}
