import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entity/base.entity';
import { UsersModel } from '../../users/entity/users.entity';
import { MessagesModel } from '../messages/entity/messages.entity';

@Entity()
export class ChatsModel extends BaseModel {
  @ManyToMany(() => UsersModel, (user) => user.chats)
  @JoinTable()
  users: UsersModel[];

  @ManyToMany(() => UsersModel, (user) => user.activeChats)
  @JoinTable()
  activeUsers: UsersModel[];

  @OneToMany(() => MessagesModel, (message) => message.chat, { cascade: true })
  messages: MessagesModel;
}
