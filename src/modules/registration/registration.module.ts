import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FileModule } from '../file/file.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
  imports: [FileModule],
  controllers: [RegistrationController],
  providers: [PrismaService, RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
