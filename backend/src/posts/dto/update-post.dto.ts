import { PartialType } from '@nestjs/mapped-types';
import { PostsModel } from '../entity/posts.entity';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(PostsModel) {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}
