import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Student, Teacher } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { SignUpDto } from './user.dto';
import { Role } from './user.types';
import * as bcrypt from 'bcrypt';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private fileService: FileService,
  ) {}

  private async updateTeacher(id: number, payload: any) {
    const { profilePicture } = payload;

    const userUpdated = await this.prismaService.teacher.update({
      where: {
        id,
      },
      data: {
        email: payload.email,
        first_name: payload.firstName,
        last_name: payload.lastName,
        gender: payload.gender,
      },
    });

    if (!profilePicture) return userUpdated;

    const userWithProfilePicture = await this.prismaService.teacher.findFirst({
      where: {
        id,
      },
      select: {
        profile_picture: true,
      },
    });

    if (userWithProfilePicture.profile_picture) {
      return await this.prismaService.profilePicture.update({
        where: {
          id: payload.profilePicture.id,
        },
        data: {
          size: payload.profilePicture.size,
          title: payload.profilePicture.title,
          type: payload.profilePicture.type,
        },
      });
    }

    return await this.prismaService.profilePicture.create({
      data: {
        size: payload.profilePicture.size,
        title: payload.profilePicture.title,
        type: payload.profilePicture.type,
      },
    });
  }

  private async updateStudent(id: number, payload: any) {
    const { profilePicture } = payload;
    const userUpdated = await this.prismaService.student.update({
      where: {
        id,
      },
      data: {
        email: payload.email,
        first_name: payload.firstName,
        last_name: payload.lastName,
        gender: payload.gender,
      },
    });

    if (!profilePicture) return userUpdated;

    const userWithProfilePicture = await this.prismaService.student.findFirst({
      where: {
        id,
      },
      select: {
        profile_picture: true,
      },
    });
    if (userWithProfilePicture.profile_picture) {
      return await this.prismaService.profilePicture.update({
        where: {
          id: payload.profilePicture.id,
        },
        data: {
          size: payload.profilePicture.size,
          title: payload.profilePicture.title,
          type: payload.profilePicture.type,
        },
      });
    }

    return await this.prismaService.profilePicture.create({
      data: {
        size: payload.profilePicture.size,
        title: payload.profilePicture.title,
        type: payload.profilePicture.type,
      },
    });
  }

  async signUp(
    signUpDto: SignUpDto,
    role: Role,
  ): Promise<Student | Teacher | never> {
    const { password, confirmPassword, email } = signUpDto;

    if (role !== 'student' && role !== 'teacher') {
      throw new BadRequestException({
        message: 'Invalid role',
      });
    }

    const user = await this.findByEmailAndRole(email, role);

    if (user) {
      throw new ConflictException({
        message: 'user already registered',
      });
    }
    if (password !== confirmPassword) {
      throw new BadRequestException({
        message: 'Passwords must match',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService[role as string].create({
      data: {
        email,
        password: hashedPassword,
        created_at: new Date(),
      },
    });
  }

  async editProfile(id: number, payload: any) {
    console.log('PAY', payload);
    return payload.role === 'student'
      ? this.updateStudent(id, payload)
      : this.updateTeacher(id, payload);
  }

  async getProfile(id: number, role: Role) {
    let profile: any;

    console.log('ROLELE', role);

    if (role === 'student') {
      profile = await this.prismaService.student.findUnique({
        where: {
          id,
        },
        select: {
          email: true,
          first_name: true,
          last_name: true,
          gender: true,
          registrations: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                  code: true,
                },
              },
            },
          },
          profile_picture: {
            select: {
              title: true,
              id: true,
            },
          },
        },
      });
    } else if (role === 'teacher') {
      profile = await this.prismaService.teacher.findUnique({
        where: {
          id,
        },
        select: {
          email: true,
          first_name: true,
          last_name: true,
          gender: true,
          profile_picture: {
            select: {
              title: true,
              id: true,
            },
          },
          courses: {
            select: {
              id: true,
              title: true,
              code: true,
            },
          },
        },
      });
    }

    const profilePictureFile = this.fileService.getProfilePicture(id);

    return {
      ...profile,
      profilePictureFile,
    };
  }

  async findByEmailAndRole(
    email: string,
    role: Role,
  ): Promise<Student | Teacher | null> {
    return await this.prismaService[role as string].findUnique({
      where: {
        email,
      },
    });
  }
}
