import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { ActivityDto } from './activity.dto';
import { ActivityService } from './activity.service';

@Controller('courses/:courseId/activities')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post()
  @RequiredRoles(Roles.Teacher)
  async create(
    @Body() activityDto: Omit<ActivityDto, 'id'>,
    @Request() request: any,
    @Param('courseId') course_id: string,
  ) {
    const user = request.user;
    return await this.activityService.create(
      activityDto,
      Number(course_id),
      user,
    );
  }

  @Post(':activityId')
  @RequiredRoles(Roles.Student)
  async doActivity(
    @Request() request: any,
    @Param('activityId') activity_id: string,
  ) {
    const user = request.user;
    return await this.activityService.doActivity(Number(activity_id), user);
  }

  @Get()
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async listFromCourse(
    @Request() request: any,
    @Param('courseId') courseId: string,
  ) {
    return await this.activityService.listFromCourse(Number(courseId));
  }
}
