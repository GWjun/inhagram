import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';

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

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
