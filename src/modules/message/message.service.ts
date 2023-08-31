import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Message } from '@prisma/client';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const authorization = socket.handshake.headers.authorization;
    // get the token itself without "Bearer"
    const [auth_type, auth_token] = authorization.split(' ')[1];

    const user = this.authService.getUserFromAuthenticationToken(auth_token);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }

  async create({ course_id, content, user_id }: any): Promise<Message> {
    return await this.prismaService.message.create({
      data: {
        content,
        user_id,
        course_id,
        created_at: new Date(),
      },
    });
  }

  async getMessages({ course_id }: any) {
    return this.prismaService.message.findMany({
      where: {
        course_id,
      },
      select: {
        created_at: true,
        student: {
          select: {
            email: true,
            id: true,
          },
        },
        teacher: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    });
  }

  // async getSection(id: number) {
  //   return await this.prismaService.section.findUnique({
  //     where: {
  //       id,
  //     },
  //     select: {
  //       id: true,
  //       title: true,
  //       content: true,
  //     },
  //   });
  // }
}
