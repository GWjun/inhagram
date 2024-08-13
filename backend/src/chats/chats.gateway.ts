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

import { UsersModel } from '../users/entity/users.entity';

import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';
import { WriteMessageDto } from './messages/dto/write-message.dto';
import { ExitChatDto } from './dto/exit-chat.dto';

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

  private userSocketMap = new Map<number, string[]>();

  handleDisconnect(socket: Socket & { user: UsersModel }): any {
    console.log(`on disconnect called : ${socket.id}`);
    if (socket.user && socket.user.id && this.userSocketMap.has(socket.user.id))
      this.userSocketMap.delete(socket.user.id);
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

      if (this.userSocketMap.has(user.id))
        this.userSocketMap.get(user.id).push(socket.id);
      else this.userSocketMap.set(user.id, [socket.id]);

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
      await this.chatsService.createChat([fromUserId, toUserId]);
      socket.emit('create_chat_complete');

      const toSocketId = this.userSocketMap.get(toUserId);
      if (toSocketId) {
        this.server.to(toSocketId).emit('create_chat_complete');
      }
    } else {
      throw new WsException({
        code: 'CHAT_ALREADY_EXIST',
        message: `이미 존재하는 채팅 입니다.`,
      });
    }
  }

  @SubscribeMessage('enter_chat')
  async enterChat(@ConnectedSocket() socket: Socket & { user: UsersModel }) {
    const chatIds = await this.chatsService.getChatIdsByUserId(socket.user.id);

    socket.join(chatIds.map((x) => x.toString()));
  }

  @SubscribeMessage('exit_chat')
  async exitChat(
    @MessageBody() dto: ExitChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    await this.chatsService.exitChat(socket.user.id, dto.chatId);
    socket.emit('exit_chat_complete');
    socket.to(dto.chatId.toString()).emit('message_received');
  }

  @SubscribeMessage('write_start')
  async writeStartMessage(
    @MessageBody() dto: WriteMessageDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const senderSocketIds = this.userSocketMap.get(socket.user.id) || [];
    const roomSockets = await this.server
      .in(dto.chatId.toString())
      .fetchSockets();

    for (const roomSocket of roomSockets) {
      if (!senderSocketIds.includes(roomSocket.id)) {
        roomSocket.emit('write_start_complete', dto.chatId.toString());
      }
    }
  }

  @SubscribeMessage('write_stop')
  async writeStopMessage(
    @MessageBody() dto: WriteMessageDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    socket
      .to(dto.chatId.toString())
      .emit('write_stop_complete', dto.chatId.toString());
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatIds = await this.chatsService.getChatIdsByUserId(socket.user.id);
    if (chatIds.includes(dto.chatId)) {
      try {
        const message = await this.messagesService.createMessage(
          dto,
          socket.user.id,
        );
        socket.to(message.chat.id.toString()).emit('message_received');
        socket.emit('message_transmit_success');
      } catch (error) {
        console.error(error);
        socket.emit('message_transmit_fail');
      }
    } else {
      throw new WsException({
        code: 'CHAT_NOT_FOUND',
        message: `Chat with ID ${dto.chatId} does not exist`,
      });
    }
  }
}
