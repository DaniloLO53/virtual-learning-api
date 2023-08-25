import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ArticleDto, SectionDto } from './article.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TokenPayloadDto } from '../auth/auth.dto';
import { Article, Section } from '@prisma/client';

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

  async getArticles(course_id: number) {
    return await this.prismaService.article.findMany({
      where: {
        course_id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        sections: {
          select: {
            title: true,
            id: true,
            updated_at: true,
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
      orderBy: {
        created_at: 'asc',
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

  async createSection(
    sectionDto: Omit<SectionDto, 'id'>,
    article_id: number,
  ): Promise<Section> {
    const { content, title } = sectionDto;
    return await this.prismaService.section.create({
      data: {
        title,
        content,
        article_id,
        created_at: new Date(),
      },
    });
  }

  async getSection(id: number) {
    return await this.prismaService.section.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });
  }

  async updateSection(
    sectionDto: SectionDto,
    user: TokenPayloadDto,
  ): Promise<Section | never> {
    const { title, content } = sectionDto;

    const section = await this.prismaService.section.findUnique({
      where: { id: sectionDto.id },
      include: {
        article: {
          include: {
            course: {
              include: {
                teacher: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!section) {
      throw new NotFoundException({
        message: 'Section not found',
      });
    }
    if (section.article.course.teacher_id !== user.id) {
      throw new UnauthorizedException({
        message: 'Can only modify own description',
      });
    }

    return await this.prismaService.section.update({
      where: { id: sectionDto.id },
      data: { title, content, updated_at: new Date() },
    });
  }

  async deleteSection(
    id: number,
    user: TokenPayloadDto,
  ): Promise<Section | never> {
    const section = await this.prismaService.section.findUnique({
      where: { id },
      include: {
        article: {
          include: {
            course: {
              include: {
                teacher: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!section) {
      throw new NotFoundException({
        message: 'Course not found',
      });
    }
    if (section.article.course.teacher_id !== user.id) {
      throw new UnauthorizedException({
        message: 'Can only modify own content',
      });
    }

    return await this.prismaService.section.delete({ where: { id } });
  }
}
