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

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(signUpDto: SignUpDto, role: Role): Promise<any> {
    const { password, email } = signUpDto;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService[role as string].create({
      data: {
        email,
        password: hashedPassword,
        created_at: new Date(),
      },
    });
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
