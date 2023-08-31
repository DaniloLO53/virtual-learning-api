import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthService } from '../auth/auth.service';
import { MessageService } from '../message/message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const user = this.authService.getUserFromAuthenticationToken(token);

    if (!user) {
      client.disconnect(true);
    } else {
      console.log(`Client ${client.id} connected. Auth token: ${token}`);
      return user;
    }
  }

  // @SubscribeMessage('leave')
  // handleLeave(client: Socket, courseId: number) {
  //   console.log(`Client ${client.id} leaved room: ${courseId}`);
  //   client.leave(courseId.toString());
  //   return courseId;
  // }

  // @SubscribeMessage('message')
  // async handleMessage(client: Socket, createMessageDto: any) {
  //   console.log(
  //     `Client ${client.id} sended message: ${createMessageDto.content} to room: ${createMessageDto.courseId}`,
  //   );
  //   const message = await this.messageService.create(createMessageDto);
  //   client.emit('message', message);
  //   client.to(message.room.toString()).emit('message', message);
  // }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }
}
