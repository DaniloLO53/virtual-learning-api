import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { CourseDto } from './course.dto';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  @RequiredRoles(Roles.Teacher)
  async create(
    @Body() courseDto: Omit<CourseDto, 'id'>,
    @Request() request: any,
  ) {
    const user = request.user;
    return await this.courseService.create(courseDto, user);
  }

  @Put(':id')
  @RequiredRoles(Roles.Teacher)
  async update(
    @Body() courseDto: CourseDto,
    @Request() request: any,
    @Param('id') id: string,
  ) {
    return await this.courseService.update(
      { ...courseDto, id: Number(id) },
      request.user,
    );
  }

  @Delete(':id')
  @RequiredRoles(Roles.Teacher)
  async delete(@Request() request: any, @Param('id') id: string) {
    return await this.courseService.delete(Number(id), request.user);
  }
}
