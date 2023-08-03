import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from '../user/user.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
  imports: [UserModule],
  controllers: [RegistrationController],
  providers: [PrismaService, RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
