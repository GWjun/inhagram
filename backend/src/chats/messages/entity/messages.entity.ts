import { BaseModel } from '../../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatsModel } from '../../entity/chats.entity';
import { UsersModel } from '../../../users/entity/users.entity';
import { IsBoolean, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

@Entity()
export class MessagesModel extends BaseModel {
  @ManyToOne(() => ChatsModel, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: ChatsModel;

  @ManyToOne(() => UsersModel, (user) => user.messages)
  author: UsersModel;

  @Column()
  @IsString()
  message: string;

  @Column({ nullable: true })
  @Optional()
  @IsBoolean()
  notice?: boolean;
}
