import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [PrismaService, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
