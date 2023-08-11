import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Post,
  Headers,
  Response,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Response as IResponse } from 'express';
import { Public } from 'src/decorators/isPublic.decorator';
import { Role } from '../user/user.types';
import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Headers('role') role: Role,
    @Response({ passthrough: true }) response: IResponse,
  ) {
    const { access_token } = await this.authService.signIn(signInDto, role);
    await this.cacheManager.set(
      'access_token',
      `Bearer ${access_token}`,
      60 * 60 * 24,
    );

    return { access_token };
  }
}
