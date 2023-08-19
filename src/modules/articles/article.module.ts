import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ArticleControler } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [],
  controllers: [ArticleControler],
  providers: [PrismaService, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
