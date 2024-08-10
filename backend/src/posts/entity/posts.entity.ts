import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entity/users.entity';

import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { IsString } from 'class-validator';
import { ImageModel } from '../../common/entity/image.entity';
import { CommentsModel } from '../comments/entity/comments.entity';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  author: UsersModel;

  @Column({ nullable: true })
  @IsString({
    message: 'title must be string type',
  })
  title: string;

  @Column({ nullable: true })
  @IsString({
    message: 'content must be string type',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @OneToMany(() => ImageModel, (image) => image.post)
  images: ImageModel[];

  @OneToMany(() => CommentsModel, (comment) => comment.post)
  comments: CommentsModel[];
}
