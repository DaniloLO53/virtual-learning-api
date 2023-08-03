import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from '../user/user.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [UserModule],
  controllers: [CourseController],
  providers: [PrismaService, CourseService],
  exports: [CourseService],
})
export class CourseModule {}
