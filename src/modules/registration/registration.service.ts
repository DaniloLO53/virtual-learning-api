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

  async delete(student_id: number, registration_id: number) {
    console.log('student_id', student_id);
    console.log('registration_id', registration_id);
    const registration = await this.prismaService.registration.findFirst({
      where: {
        id: registration_id,
      },
    });
    // const registrations = await this.prismaService.registration.findMany();
    // console.log('reg', registrations);
    if (!registration) {
      throw new NotFoundException({
        message: 'Registration not found',
      });
    }

    await this.prismaService.registration.delete({
      where: {
        id: registration.id,
      },
    });

    return await this.getParticipants(registration.course_id);
  }

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
