import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { Registration } from '@prisma/client';
import { RegistrationDto } from './registration.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(registrationDto: RegistrationDto): Promise<Registration> {
    const { student_id, course_id, password } = registrationDto;

    const course = await this.prismaService.course.findUnique({
      where: {
        id: course_id,
      },
      include: {
        registrations: {
          where: {
            student_id,
          },
        },
      },
    });
    console.log(course);
    if (!course) {
      throw new NotFoundException({
        message: 'Course not found',
      });
    }
    if (course.registrations.length !== 0) {
      throw new ConflictException({
        message: 'User already registered',
      });
    }
    if (!course.opened) {
      throw new ConflictException({
        message: 'Course not accepting registrations',
      });
    }

    const validatePassword = await bcrypt.compare(
      password,
      course.password || '',
    );

    if (course.password && !validatePassword) {
      throw new UnauthorizedException({
        message: 'Incorrect password',
      });
    }

    return await this.prismaService.registration.create({
      data: {
        student_id,
        course_id,
        created_at: new Date(),
      },
    });
  }
}
