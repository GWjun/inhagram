import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { PostsService } from '../../posts.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postService: PostsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('need postId ');
    }

    const exists = await this.postService.checkPostExistById(parseInt(postId));

    if (!exists) {
      throw new BadRequestException('post not exist');
    }

    next();
  }
}
