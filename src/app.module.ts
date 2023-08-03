import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, AuthModule, CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
