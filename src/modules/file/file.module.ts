import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [PrismaService, FileService],
  exports: [FileService],
})
export class FileModule {}
