import { Body, Controller, Post, Headers } from '@nestjs/common';
import { Role } from '../user/user.types';
import { signInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: signInDto, @Headers('role') role: Role) {
    return await this.authService.signIn(signInDto, role);
  }
}
