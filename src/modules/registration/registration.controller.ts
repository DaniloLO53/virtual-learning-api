import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { RegistrationDto } from './registration.dto';
import { RegistrationService } from './registration.service';

@Controller('registrations')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Get('courses/:courseId')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async getParticipants(
    @Request() request: any,
    @Param('courseId') courseId: string,
  ) {
    return await this.registrationService.getParticipants(Number(courseId));
  }

  @Post()
  @RequiredRoles(Roles.Student)
  async create(
    @Body() registrationDto: Omit<RegistrationDto, 'student_id'>,
    @Request() request: any,
  ) {
    const { id } = request.user;
    return await this.registrationService.create({
      ...registrationDto,
      student_id: id,
    });
  }

  @Delete(':registrationId')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async delete(
    @Param('registrationId') registrationId: string,
    @Request() request: any,
  ) {
    const { id, role } = request.user;
    return await this.registrationService.delete(id, Number(registrationId));
  }
}
