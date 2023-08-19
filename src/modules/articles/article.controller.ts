import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { ArticleDto } from './article.dto';
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

  // @Put(':id')
  // @RequiredRoles(Roles.Teacher)
  // async update(
  //   @Body() articleDto: ArticleDto,
  //   @Request() request: any,
  //   @Param('id') id: string,
  // ) {
  //   return await this.courseService.update(
  //     { ...articleDto, id: Number(id) },
  //     request.user,
  //   );
  // }

  // @Delete(':id')
  // @RequiredRoles(Roles.Teacher)
  // async delete(@Request() request: any, @Param('id') id: string) {
  //   return await this.courseService.delete(Number(id), request.user);
  // }

  @Get(':id')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async getArticleSummary(@Request() request: any, @Param('id') id: string) {
    const { userId } = request.user;

    return await this.articleService.getArticleSummary(Number(id));
  }
}
