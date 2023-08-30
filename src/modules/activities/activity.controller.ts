import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
    @Body() body: any,
  ) {
    const user = request.user;
    return await this.activityService.doActivity(
      Number(activity_id),
      body,
      user,
    );
  }

  @Get(':activityId/submits')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async getActivitiesDone(
    @Request() request: any,
    @Param('activityId') activityId: string,
  ) {
    const user = request.user;

    return await this.activityService.getActivitiesDone(
      Number(activityId),
      user.id,
    );
  }

  @Get(':activityId/done')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async getActivityDone(
    @Request() request: any,
    @Param('activityId') activityId: string,
  ) {
    const user = request.user;

    return await this.activityService.getActivityDone(
      Number(activityId),
      user.id,
    );
  }

  @Get(':activityId/submissions/:submissionId')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async getSubmission(
    @Request() request: any,
    @Param('submissionId') submissionId: string,
  ) {
    const user = request.user;

    return await this.activityService.getSubmission(
      Number(submissionId),
      user.id,
    );
  }

  @Put(':activityId/submissions/:submissionId/grade')
  @RequiredRoles(Roles.Teacher)
  async assignGrade(
    @Request() request: any,
    @Param('submissionId') submissionId: string,
    @Body() body: any,
  ) {
    const user = request.user;

    return await this.activityService.assignGrade(
      Number(submissionId),
      body,
      user.id,
    );
  }

  @Delete(':activityId/done/:id')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async deleteActivityDone(@Request() request: any, @Param('id') id: string) {
    const user = request.user;

    return await this.activityService.deleteActivityDone(Number(id), user.id);
  }

  @Get()
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async listFromCourse(
    @Request() request: any,
    @Param('courseId') courseId: string,
  ) {
    return await this.activityService.listFromCourse(Number(courseId));
  }

  @Get(':activityId')
  @RequiredRoles(Roles.Student, Roles.Teacher)
  async getActivity(
    @Request() request: any,
    @Param('activityId') activityId: string,
  ) {
    return await this.activityService.getActivity(Number(activityId));
  }
}
