import { Body, Controller, Post, Headers } from '@nestjs/common';
import { Public } from 'src/decorators/isPublic.decorator';
import { Role } from '../user/user.types';
import { SignUpDto } from './user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Headers('role') role: Role) {
    const newUser = await this.userService.signUp(signUpDto, role);
    console.log(newUser);
    return newUser;
  }
}
