import { Body, Controller, Delete, Post, Request } from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { RegistrationDto } from './registration.dto';
import { RegistrationService } from './registration.service';

@Controller('registrations')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

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

  @Delete()
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async delete(
    @Body() registrationDto: Omit<RegistrationDto, 'student_id'>,
    @Request() request: any,
  ) {
    const { id, role } = request.user;
    return await this.registrationService.create({
      ...registrationDto,
      student_id: id,
    });
  }
}