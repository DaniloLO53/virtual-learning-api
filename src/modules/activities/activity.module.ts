import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FileModule } from '../file/file.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [FileModule],
  controllers: [ActivityController],
  providers: [PrismaService, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
