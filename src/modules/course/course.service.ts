import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CourseDto } from './course.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TokenPayloadDto } from '../auth/auth.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(courseDto: CourseDto, user: TokenPayloadDto): Promise<any> {
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
}
