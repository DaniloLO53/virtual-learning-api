import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from '../user/user.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [UserModule],
  controllers: [ActivityController],
  providers: [PrismaService, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
