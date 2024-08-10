import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from '../../common/common.service';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CommentsModel } from './entity/comments.entity';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UsersModel } from '../../users/entity/users.entity';
import { DEFAULT_USER_SELECT_OPTIONS } from '../../users/const/default-user-select-options.const';
import { UpdateCommentsDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentsRepository: Repository<CommentsModel>,
    private readonly commonService: CommonService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<CommentsModel>(CommentsModel)
      : this.commentsRepository;
  }

  paginateComments(dto: BasePaginationDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentsRepository,
      {
        where: {
          post: { id: postId },
        },
        relations: { author: true },
        ...DEFAULT_USER_SELECT_OPTIONS,
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: { author: true },
      ...DEFAULT_USER_SELECT_OPTIONS,
    });

    if (!comment) {
      throw new BadRequestException(`id: ${id} comment not exist`);
    }

    return comment;
  }

  async createComment(
    dto: CreateCommentsDto,
    postId: number,
    author: UsersModel,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    return repository.save({
      ...dto,
      post: {
        id: postId,
      },
      author,
    });
  }

  async updateComment(
    dto: UpdateCommentsDto,
    userId: number,
    commentId: number,
  ) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
        author: { id: userId },
      },
    });

    if (!comment) throw new BadRequestException('comment not exist');

    const prevComment = await this.commentsRepository.preload({
      id: commentId,
      ...dto,
    });

    return await this.commentsRepository.save(prevComment);
  }

  async deleteComment(userId: number, commentId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const comment = await repository.findOne({
      where: {
        id: commentId,
        author: { id: userId },
      },
    });

    if (!comment) throw new BadRequestException('comment not exist');

    await repository.delete(commentId);

    return commentId;
  }
}
