import { Body, Controller, Post, Headers } from '@nestjs/common';
import { Public } from 'src/decorators/isPublic.decorator';
import { Role } from '../user/user.types';
import { SignUpDto } from './user.dto';
import { UserService } from './user.service';

@Controller('sign-up')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post()
  async signUp(@Body() signUpDto: SignUpDto, @Headers('role') role: Role) {
    return await this.userService.signUp(signUpDto, role);
  }
}
