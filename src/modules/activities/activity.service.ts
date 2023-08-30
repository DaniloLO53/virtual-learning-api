import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { TokenPayloadDto } from '../auth/auth.dto';
import { ActivityDto } from './activity.dto';
import { parseDate } from './activity.utils';
import { FileService } from '../file/file.service';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  async listFromCourse(course_id: number) {
    const activities = await this.prismaService.activity.findMany({
      where: {
        course_id,
      },
      orderBy: {
        deadline: 'desc',
      },
    });

    return activities.map((activity) => ({
      ...activity,
      files: this.fileService.getActivityFiles(activity.uuid),
    }));
  }

  async getActivity(activity_id: number) {
    return await this.prismaService.activity.findUnique({
      where: {
        id: activity_id,
      },
      select: {
        course_id: true,
        deadline: true,
        description: true,
        title: true,
        id: true,
        uuid: true,
      },
    });
  }

  async getActivityDone(activity_id: number, student_id: number) {
    const activityDone = await this.prismaService.activitiesDone.findFirst({
      where: {
        activity_id,
        student_id,
      },
      select: {
        created_at: true,
        activity_id: true,
        student_id: true,
        uuid: true,
        id: true,
        grade: true,
        description: true,
        activity: {
          select: {
            uuid: true,
          },
        },
      },
    });

    return activityDone;
  }

  async getSubmission(id: number, student_id: number) {
    const activityDone = await this.prismaService.activitiesDone.findFirst({
      where: {
        id,
      },
      select: {
        created_at: true,
        activity_id: true,
        student_id: true,
        uuid: true,
        id: true,
        grade: true,
        description: true,
        activity: {
          select: {
            uuid: true,
          },
        },
      },
    });

    console.log('SUBMISSION', activityDone);
    return activityDone;
  }

  async getActivitiesDone(activity_id: number, student_id: number) {
    const activityDone = await this.prismaService.activitiesDone.findMany({
      where: {
        activity_id,
      },
      select: {
        student: {
          select: {
            email: true,
          },
        },
        activity: {
          select: {
            id: true,
          },
        },
        id: true,
      },
    });

    return activityDone;
  }

  async create(
    activityDto: Omit<ActivityDto, 'id'>,
    course_id: number,
    user: TokenPayloadDto,
  ): Promise<any> {
    const { title, description, deadline, uuid, file } = activityDto;

    console.log('File', file);

    const course = await this.prismaService.course.findUnique({
      where: {
        id: course_id,
      },
    });

    if (!course) {
      throw new ConflictException({
        message: 'Course not found',
      });
    }
    if (course.teacher_id !== user.id) {
      throw new UnauthorizedException({
        message: 'Only own content can be adited',
      });
    }

    const dateFormatedDeadline = parseDate(deadline);

    return await this.prismaService.activity.create({
      data: {
        title,
        description,
        deadline: dateFormatedDeadline,
        course_id,
        uuid,
        created_at: new Date(),
      },
    });
  } //

  async doActivity(
    activity_id: number,
    body: any,
    user: TokenPayloadDto,
  ): Promise<any> {
    const activity = await this.prismaService.activity.findUnique({
      where: {
        id: activity_id,
      },
    });
    const activityDone = await this.prismaService.activitiesDone.findFirst({
      where: {
        activity_id,
        student_id: user.id,
      },
    });
    if (!activity) {
      throw new NotFoundException({
        message: 'Activity not found',
      });
    }
    if (activityDone) {
      throw new NotFoundException({
        message: 'Activity already done',
      });
    }

    return await this.prismaService.activitiesDone.create({
      data: {
        activity_id,
        student_id: user.id,
        uuid: body.uuid,
        created_at: new Date(),
      },
    });
  }

  async assignGrade(
    submission_id: number,
    body: any,
    user: TokenPayloadDto,
  ): Promise<any> {
    return await this.prismaService.activitiesDone.update({
      where: {
        id: submission_id,
      },
      data: {
        grade: body.grade,
        description: body.description || '',
      },
    });
  }

  async deleteActivity(
    activity_id: number,
    user: TokenPayloadDto,
  ): Promise<any> {
    const activity = await this.prismaService.activity.findUnique({
      where: {
        id: activity_id,
      },
    });
    if (!activity) {
      throw new NotFoundException({
        message: 'Activity not found',
      });
    }

    return await this.prismaService.activity.delete({
      where: {
        id: activity_id,
      },
    });
  }

  async deleteActivityDone(id: number, user: TokenPayloadDto): Promise<any> {
    const activity = await this.prismaService.activitiesDone.findUnique({
      where: {
        id,
      },
    });
    if (!activity) {
      throw new NotFoundException({
        message: 'Activity not found',
      });
    }

    return await this.prismaService.activitiesDone.delete({
      where: {
        id,
      },
    });
  }
}
