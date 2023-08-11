import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Role } from '../user/user.types';
import { SignInDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto, role: Role): Promise<any> {
    const { password, email } = signInDto;

    console.log('Role', role);

    if (role !== 'student' && role !== 'teacher') {
      throw new BadRequestException({
        message: 'Invalid role',
      });
    }

    const user = await this.userService.findByEmailAndRole(email, role);
    const passwordValidation = await bcrypt.compare(
      password,
      user?.password || '',
    );

    if (!user || !passwordValidation) {
      throw new UnauthorizedException({
        message: 'user not found',
      });
    }

    const { password: pass, updated_at, created_at, ...payload } = user;

    return {
      access_token: await this.jwtService.signAsync({ ...payload, role }),
    };
  }
}
