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

  async create(
    courseDto: Omit<CourseDto, 'id'>,
    user: TokenPayloadDto,
  ): Promise<Course> {
    const { title, content, password } = courseDto;

    const hashedPassword = await bcrypt.hash(password || 'default', 10);

    return await this.prismaService.course.create({
      data: {
        title,
        content,
        password: password ? hashedPassword : null,
        teacher_id: user.id,
        created_at: new Date(),
      },
    });
  }

  async update(
    courseDto: CourseDto,
    user: TokenPayloadDto,
  ): Promise<Course | never> {
    const { title, content, opened } = courseDto;

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
      data: { title, content, opened },
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
