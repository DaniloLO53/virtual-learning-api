import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseFilePipeBuilder,
  Post,
  Request,
  Response,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';
import { Request as IRequest, Response as IResponse } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { FileService } from './file.service';
import { findFilesForId } from './file.utils';

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: IRequest, file, cb) => {
      const { activityUUID } = req.params;
      const currentTimeFormatted = new Date().getTime();
      cb(null, `${currentTimeFormatted}_${activityUUID}_${file.originalname}`);
    },
  }),
};

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('activities/:activityUUID/upload/teacher')
  @RequiredRoles(Roles.Teacher)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }], multerConfig))
  uploadFileAndPassValidation(
    @Body() body: any,
    @Request() req: any,
    @Headers() headers: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('UPLOADED');
    console.log('files from req', req.files.files);
    return {
      body,
      files,
    };
  }
  //
  @Get('activities/:activityUUID')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  getActivityFiles(
    @Param('activityUUID') activityUUID: string,
    @Response({ passthrough: true }) response: IResponse,
  ): any {
    return this.fileService.getActivityFiles(activityUUID);
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
}
