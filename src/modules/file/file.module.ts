import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from '../user/user.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [UserModule],
  controllers: [FileController],
  providers: [PrismaService, FileService],
  exports: [FileService],
})
export class FileModule {}
