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

  async doActivity(activity_id: number, user: TokenPayloadDto): Promise<any> {
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
        created_at: new Date(),
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
}
