import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { BaseModel } from './base.entity';
import { PostsModel } from '../../posts/entities/posts.entity';
import * as process from 'node:process';

export enum ImageModelType {
  POST_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    enum: ImageModelType,
  })
  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageModelType.POST_IMAGE)
      return `https://storage.googleapis.com/${process.env['STORAGE_BUCKET']}/${value}`;
    else return value;
  })
  path: string;

  @ManyToOne((type) => PostsModel, (post) => post.images)
  post?: PostsModel;
}
