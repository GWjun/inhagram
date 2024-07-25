import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { ChatsMessagesService } from './messages/messages.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

import { UsersModel } from '../users/entities/users.entity';

import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';

import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from '../common/exception-filter/socket-catch-http.exception-filter';

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseFilters(SocketCatchHttpExceptionFilter)
@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: ChatsMessagesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(socket: Socket): any {
    console.log(`on disconnect called : ${socket.id}`);
  }

  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on connect called : ${socket.id}`);

    const authToken = socket.handshake.auth;
    const headerToken = socket.handshake.headers['authorization'];

    let rawToken: string;
    if (!authToken.token && !headerToken) {
      socket.disconnect();
      return;
    } else if (authToken.token) {
      rawToken = authToken.token;
    } else {
      rawToken = headerToken;
    }

    try {
      const token = this.authService.extractToken(rawToken, true);

      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;

      socket.emit('setup_complete');
      return true;
    } catch (error) {
      console.error(error);
      socket.disconnect();
    }
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const fromUserId = socket.user.id;
    const toUserId = await this.usersService.getIdByNickname(data.toUserName);
    const chatId = await this.chatsService.getCommonChatIdByUserIds(
      fromUserId,
      toUserId,
    );

    if (!chatId) {
      const chat = await this.chatsService.createChat([fromUserId, toUserId]);
      socket.join(chat.id.toString());
    } else {
      throw new WsException({
        code: 'CHAT_ALREADY_EXIST',
        message: `Chat is already exist`,
      });
    }
  }

  @SubscribeMessage('enter_chat')
  async enterChat(@ConnectedSocket() socket: Socket & { user: UsersModel }) {
    const chatIds = await this.chatsService.getChatIdsByUserId(socket.user.id);

    socket.join(chatIds.map((x) => x.toString()));
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatIds = await this.chatsService.getChatIdsByUserId(socket.user.id);
    if (chatIds.includes(dto.chatId)) {
      const message = await this.messagesService.createMessage(
        dto,
        socket.user.id,
      );
      this.server.to(message.chat.id.toString()).emit('message_received');
    } else {
      throw new WsException({
        code: 'CHAT_NOT_FOUND',
        message: `Chat with ID ${dto.chatId} does not exist`,
      });
    }
  }
}
