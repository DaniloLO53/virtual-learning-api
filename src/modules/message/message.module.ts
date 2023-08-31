import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [MessageController],
  providers: [PrismaService, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
