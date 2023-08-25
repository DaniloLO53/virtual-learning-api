import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseFilePipeBuilder,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { ActivityDto } from './activity.dto';
import { ActivityService } from './activity.service';

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${new Date()}-${file.originalname}`);
    },
  }),
};

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

  // @Post('upload/teacher')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }], multerConfig))
  // uploadFileAndPassValidation(
  //   @Body() body: any,
  //   @UploadedFiles(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'png',
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 10000,
  //       })
  //       .build({
  //         errorHttpStatusCode: 422,
  //       }),
  //   )
  //   files: Array<Express.Multer.File>,
  // ) {
  //   return {
  //     body,
  //     files,
  //   };
  // }

  @Post('upload/teacher')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }], multerConfig))
  uploadFileAndPassValidation(
    @Body() body: any,
    @Request() req: any,
    @Headers() headers: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('files', files);
    console.log('request files', req.files);
    // console.log('headers', headers);
    return {
      body,
      files,
    };
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
