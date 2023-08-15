import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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

  @Get()
  @RequiredRoles(Roles.Student)
  async listAll(@Request() request: any) {
    const { id } = request.user;

    return await this.courseService.listAll(id);
  }

  @Get(':courseId/registration')
  @RequiredRoles(Roles.Student)
  async getRegistrationInfos(
    @Request() request: any,
    @Param('courseId') courseId: string,
  ) {
    return await this.courseService.getRegistrationInfos(Number(courseId));
  }

  @Get('query')
  @RequiredRoles(Roles.Student)
  async getByQueries(@Request() request: any, @Query('query') query: string) {
    return await this.courseService.getByQueries(query);
  }
}
