import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './modules/activities/activity.module';
import { ArticleModule } from './modules/articles/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { CourseModule } from './modules/course/course.module';
import { FileModule } from './modules/file/file.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CourseModule,
    ArticleModule,
    RegistrationModule,
    FileModule,
    ActivityModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
