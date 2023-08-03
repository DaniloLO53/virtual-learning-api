import { Body, Controller, Post, Request } from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { CourseDto } from './course.dto';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  @RequiredRoles(Roles.Teacher)
  async create(@Body() courseDto: CourseDto, @Request() request: any) {
    const user = request.user;
    return await this.courseService.create(courseDto, user);
  }
}
