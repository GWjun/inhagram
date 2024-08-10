import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { CreateCommentsDto } from './dto/create-comments.dto';

import { PostsService } from '../posts.service';
import { UsersModel } from '../../users/entity/users.entity';

import { User } from '../../users/decorator/user.decorator';
import { AccessTokenGuard } from '../../auth/guard/bearer-token.guard';
import { QueryRunner } from 'typeorm';
import { QueryRunnerDecorator } from '../../common/decorator/query-runner.decorator';
import { UpdateCommentsDto } from './dto/update-comment.dto';
import { TransactionInterceptor } from '../../common/interceptor/transaction.interceptor';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: BasePaginationDto,
  ) {
    return this.commentsService.paginateComments(query, postId);
  }

  @Get(':commentId')
  getComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentsDto,
    @User() user: UsersModel,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    const comment = await this.commentsService.createComment(
      body,
      postId,
      user,
      qr,
    );

    await this.postsService.incrementCommentCount(postId, qr);

    return comment;
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  async patchComment(
    @User('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentsDto,
  ) {
    return this.commentsService.updateComment(body, userId, commentId);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteComment(
    @User('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    const comment = await this.commentsService.deleteComment(
      userId,
      commentId,
      qr,
    );

    await this.postsService.decrementCommentCount(postId, qr);

    return comment;
  }
}
