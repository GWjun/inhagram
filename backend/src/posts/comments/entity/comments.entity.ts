import { BaseModel } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersModel } from '../../../users/entity/users.entity';
import { PostsModel } from '../../entity/posts.entity';
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class CommentsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.postComments)
  author: UsersModel;

  @ManyToOne(() => PostsModel, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostsModel;

  @Column()
  @IsString()
  comment: string;

  @Column({ default: 0 })
  @IsNumber()
  likeCount: number;
}
