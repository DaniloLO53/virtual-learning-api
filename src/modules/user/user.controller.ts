import {
  Body,
  Controller,
  Post,
  Headers,
  Request,
  Get,
  Put,
} from '@nestjs/common';
import { Public } from 'src/decorators/isPublic.decorator';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { FileService } from '../file/file.service';
import { Role } from '../user/user.types';
import { SignUpDto } from './user.dto';
import { Roles } from './user.enums';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Headers('role') role: Role) {
    const newUser = await this.userService.signUp(signUpDto, role);
    console.log(newUser);
    return newUser;
  }

  @Get('profile')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async getMyProfile(@Headers('role') role: Role, @Request() request: any) {
    const { id } = request.user;
    return await this.userService.getProfile(id, role);
  }
  @Put('profile')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async editProfile(
    @Headers('role') role: Role,
    @Request() request: any,
    @Body() payload: any,
  ) {
    const { id } = request.user;
    return await this.userService.editProfile(id, { ...payload, role });
  }
}
