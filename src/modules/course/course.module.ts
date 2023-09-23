import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FileModule } from '../file/file.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [FileModule],
  controllers: [CourseController],
  providers: [PrismaService, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
