import { Injectable } from '@nestjs/common';
import { ArticleDto } from './article.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TokenPayloadDto } from '../auth/auth.dto';
import { Article } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArticleSummary(article_id: number) {
    return await this.prismaService.article.findUnique({
      where: {
        id: article_id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        sections: {
          select: {
            title: true,
            updated_at: true,
          },
        },
      },
    });
  }

  async create(
    articleDto: Omit<ArticleDto, 'id'>,
    user: TokenPayloadDto,
  ): Promise<Article> {
    const { title, description, course_id } = articleDto;

    return await this.prismaService.article.create({
      data: {
        title,
        description,
        course_id,
        created_at: new Date(),
      },
    });
  }

  // async update(
  //   courseDto: CourseDto,
  //   user: TokenPayloadDto,
  // ): Promise<Course | never> {
  //   const { title, description, opened } = courseDto;

  //   const course = await this.prismaService.course.findUnique({
  //     where: { id: courseDto.id },
  //   });
  //   if (!course) {
  //     throw new NotFoundException({
  //       message: 'Course not found',
  //     });
  //   }
  //   if (course.teacher_id !== user.id) {
  //     throw new UnauthorizedException({
  //       message: 'Can only modify own description',
  //     });
  //   }

  //   return await this.prismaService.course.update({
  //     where: { id: courseDto.id },
  //     data: { title, description, opened },
  //   });
  // }

  // async delete(id: number, user: TokenPayloadDto): Promise<Course | never> {
  //   const course = await this.prismaService.course.findUnique({
  //     where: { id },
  //   });
  //   if (!course) {
  //     throw new NotFoundException({
  //       message: 'Course not found',
  //     });
  //   }
  //   if (course.teacher_id !== user.id) {
  //     throw new UnauthorizedException({
  //       message: 'Can only modify own content',
  //     });
  //   }

  //   return await this.prismaService.course.delete({ where: { id } });
  // }
}
