import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';

import { Column, Entity, ManyToOne } from 'typeorm';

import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { join } from 'path';
import { POST_PUBLIC_IMAGE_PATH } from '../../common/const/path.const';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  author: UsersModel;

  @IsString({
    message: 'title must be string type',
  })
  title: string;

  @IsString({
    message: 'content must be string type',
  })
  content: string;

  @Column({ nullable: true })
  @Transform(({ value }) => value && `/${join(POST_PUBLIC_IMAGE_PATH, value)}`)
  image?: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
