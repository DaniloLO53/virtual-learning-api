import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { ArticleDto, SectionDto } from './article.dto';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  @RequiredRoles(Roles.Teacher)
  async create(
    @Body() articleDto: Omit<ArticleDto, 'id'>,
    @Request() request: any,
  ) {
    const user = request.user;
    return await this.articleService.create(articleDto, user);
  }

  @Post(':articleId')
  @RequiredRoles(Roles.Teacher)
  async createSection(
    @Body() sectionDto: Omit<SectionDto, 'id'>,
    @Request() request: any,
    @Param('articleId') articleId: string,
  ) {
    const user = request.user;
    return await this.articleService.createSection(
      sectionDto,
      Number(articleId),
    );
  }

  @Put('sections/:id')
  @RequiredRoles(Roles.Teacher)
  async update(
    @Body() sectionDto: Omit<SectionDto, 'id'>,
    @Request() request: any,
    @Param('id') id: string,
  ) {
    return await this.articleService.updateSection(
      { ...sectionDto, id: Number(id) },
      request.user,
    );
  }

  @Delete('sections/:id')
  @RequiredRoles(Roles.Teacher)
  async delete(@Request() request: any, @Param('id') id: string) {
    return await this.articleService.deleteSection(Number(id), request.user);
  }

  @Get('sections/:id')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async getSection(@Request() request: any, @Param('id') id: string) {
    const { userId } = request.user;

    return await this.articleService.getSection(Number(id));
  }

  @Get(':id')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async getArticleSummary(@Request() request: any, @Param('id') id: string) {
    const { userId } = request.user;

    return await this.articleService.getArticleSummary(Number(id));
  }

  @Get('course/:courseId')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async getArticles(
    @Request() request: any,
    @Param('courseId') courseId: string,
  ) {
    const { userId } = request.user;

    return await this.articleService.getArticles(Number(courseId));
  }
}
