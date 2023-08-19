import { Body, Controller, Post, Headers, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { Public } from 'src/decorators/isPublic.decorator';
import { Role } from '../user/user.types';
import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Headers('role') role: Role,
    @Response({ passthrough: true }) response: IResponse,
  ) {
    const data = await this.authService.signIn(signInDto, role);

    return { access_token: data.access_token, role: data.role };
  }
}
