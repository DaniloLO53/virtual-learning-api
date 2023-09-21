import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FileModule } from '../file/file.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [FileModule],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserModule {}
