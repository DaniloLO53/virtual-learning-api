import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CourseDto } from './course.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TokenPayloadDto } from '../auth/auth.dto';
import { Course } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getByQueries(query: string) {
    if (query.length === 0) return [];

    return await this.prismaService.course.findMany({
      where: {
        opened: true,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        code: true,
        title: true,
        id: true,
        teacher: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async getRegistrationInfos(courseId: number, student_id: number) {
    return await this.prismaService.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        registrations: {
          where: {
            student_id,
          },
          select: {
            student_id: true,
          },
        },
        code: true,
        teacher: {
          select: {
            email: true,
          },
        },
        title: true,
        description: true,
        password: true,
        id: true,
      },
    });
  }

  async getParticipants(course_id: number) {
    return await this.prismaService.course.findUnique({
      where: {
        id: course_id,
      },
      select: {
        teacher: {
          select: {
            email: true,
          },
        },
        registrations: {
          where: {
            course_id,
          },
          select: {
            id: true,
            student: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getCreatedCourses(teacher_id: number) {
    return await this.prismaService.course.findMany({
      where: {
        teacher_id,
      },
      select: {
        id: true,
        code: true,
        title: true,
      },
    });
  }

  async getRegisteredCourses(student_id: number) {
    return await this.prismaService.course.findMany({
      where: {
        registrations: {
          some: {
            student_id,
          },
        },
      },
      select: {
        id: true,
        code: true,
        title: true,
        teacher: {
          select: {
            email: true,
          },
        },
        activities: {
          include: {
            activities_done: {
              where: {
                student_id,
              },
            },
          },
          orderBy: [
            {
              activities_done: {
                _count: 'asc',
              },
            },
            {
              deadline: 'asc',
            },
          ],
        },
      },
    });
  }

  async create(
    courseDto: Omit<CourseDto, 'id'>,
    user: TokenPayloadDto,
  ): Promise<Course> {
    const { title, description, password, code } = courseDto;

    const hashedPassword = await bcrypt.hash(password || 'default', 10);

    return await this.prismaService.course.create({
      data: {
        title,
        description,
        password: password ? hashedPassword : null,
        teacher_id: user.id,
        code,
        created_at: new Date(),
      },
    });
  }

  async update(
    courseDto: CourseDto,
    user: TokenPayloadDto,
  ): Promise<Course | never> {
    const { title, description, opened } = courseDto;

    const course = await this.prismaService.course.findUnique({
      where: { id: courseDto.id },
    });
    if (!course) {
      throw new NotFoundException({
        message: 'Course not found',
      });
    }
    if (course.teacher_id !== user.id) {
      throw new UnauthorizedException({
        message: 'Can only modify own description',
      });
    }

    return await this.prismaService.course.update({
      where: { id: courseDto.id },
      data: { title, description, opened },
    });
  }

  async delete(id: number, user: TokenPayloadDto): Promise<Course | never> {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException({
        message: 'Course not found',
      });
    }
    if (course.teacher_id !== user.id) {
      throw new UnauthorizedException({
        message: 'Can only modify own content',
      });
    }

    return await this.prismaService.course.delete({ where: { id } });
  }
}
