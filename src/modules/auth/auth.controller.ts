import { Body, Controller, Post, Headers } from '@nestjs/common';
import { Public } from 'src/decorators/isPublic.decorator';
import { Role } from '../user/user.types';
import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Headers('role') role: Role) {
    return await this.authService.signIn(signInDto, role);
  }
}
