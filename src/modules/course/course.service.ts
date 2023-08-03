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

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(
    courseDto: Omit<CourseDto, 'id'>,
    user: TokenPayloadDto,
  ): Promise<Course> {
    const { title, content } = courseDto;

    return await this.prismaService.course.create({
      data: {
        title,
        content,
        teacher_id: user.id,
        created_at: new Date(),
      },
    });
  }

  async update(
    courseDto: CourseDto,
    user: TokenPayloadDto,
  ): Promise<Course | never> {
    const { title, content } = courseDto;

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
        message: 'Can only modify own content',
      });
    }

    return await this.prismaService.course.update({
      where: { id: courseDto.id },
      data: { title, content },
    });
  }
}
