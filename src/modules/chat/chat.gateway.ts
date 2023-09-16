import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthService } from '../auth/auth.service';
import { MessageService } from '../message/message.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    console.log('body', body);

    this.server.emit('onMessage', {
      content: body,
    });
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id + ' connected');
    });
  }

  handleConnection(socket: Socket, ...args: any[]) {
    socket.emit('connected');
  }

  handleDisconnect(socket: Socket) {
    console.log('Disconnected');
  }
}
