import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryRunner, Repository } from 'typeorm';
import { PostsModel } from './entity/posts.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

import { CommonService } from '../common/common.service';
import { DEFAULT_USER_SELECT_OPTIONS } from '../users/const/default-user-select-options.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
  ) {}

  async checkPostExistById(id: number) {
    return this.postsRepository.exists({ where: { id } });
  }

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      {
        relations: ['author', 'images'],
        order: {
          createdAt: dto.order__createdAt,
          images: {
            order: 'ASC',
          },
        },
        select: {
          author: DEFAULT_USER_SELECT_OPTIONS,
        },
      },
      'posts',
    );
  }

  async getPostById(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const post = await repository.findOne({
      where: { id: postId },
      relations: ['author', 'images'],
      select: {
        author: DEFAULT_USER_SELECT_OPTIONS,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostsModel>(PostsModel)
      : this.postsRepository;
  }

  async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    console.log(postDto);
    const post = repository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
      images: [],
    });

    return await repository.save(post);
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['author', 'images'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (postDto.title) {
      post.title = postDto.title;
    }
    if (postDto.content) {
      post.content = postDto.content;
    }

    return await this.postsRepository.save(post);
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId, author: { id: userId } },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }

  async incrementCommentCount(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.increment(
      {
        id: postId,
      },
      'commentCount',
      1,
    );
  }

  async decrementCommentCount(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.decrement(
      {
        id: postId,
      },
      'commentCount',
      1,
    );
  }
}
