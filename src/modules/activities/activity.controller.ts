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
    @Param('courseId') courseId: string,
  ) {
    const user = request.user;
    return await this.activityService.create(
      activityDto,
      Number(courseId),
      user,
    );
  }

  @Delete(':activityId')
  @RequiredRoles(Roles.Teacher)
  async deleteActivity(
    @Request() request: any,
    @Param('activityId') activity_id: string,
  ) {
    console.log('DELETE');
    const user = request.user;
    return await this.activityService.deleteActivity(Number(activity_id), user);
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
