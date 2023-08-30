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
import { createReadStream, readFileSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { FileService } from './file.service';
import { findFilesForId } from './file.utils';
import * as path from 'path';
import { readFile } from 'fs/promises';

const multerConfigTeacher = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: any, file, cb) => {
      console.log('file', file);
      console.log('files from req', req.files.files);

      const { activityUUID } = req.params;
      const currentTimeFormatted = new Date().getTime();
      cb(null, `${currentTimeFormatted}_${activityUUID}_${file.originalname}`);
    },
  }),
};

const multerConfigStudent = {
  storage: diskStorage({
    destination: './submissions',
    filename: (req: any, file, cb) => {
      console.log('file', file);
      console.log('files from req', req.files.files);

      const { activityUUID, submissionUUID } = req.params;
      const currentTimeFormatted = new Date().getTime();
      cb(
        null,
        `${currentTimeFormatted}_${activityUUID}_${submissionUUID}_${file.originalname}`,
      );
    },
  }),
};

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('activities/:activityUUID/upload/teacher')
  @RequiredRoles(Roles.Teacher)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files' }], multerConfigTeacher),
  )
  async uploadFileAndPassValidation(
    @Body() body: any,
    @Request() req: any,
    @Headers() headers: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('UPLOADED');
    console.log('files from req 2', req.headers);

    // const res = await uploadToGoogle();

    return {
      body,
      files,
    };
  }

  @Post('activities/:activityUUID/upload/:submissionUUID')
  @RequiredRoles(Roles.Student)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files' }], multerConfigStudent),
  )
  async uploadSubmit(
    @Body() body: any,
    @Request() req: any,
    @Headers() headers: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('UPLOADED');
    console.log('files from req 2', req.headers);

    // const res = await uploadToGoogle();

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

  @Get('submissions/:submissionUUID')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  getSubmissionFiles(
    @Param('submissionUUID') submissionUUID: string,
    @Response({ passthrough: true }) response: IResponse,
  ): any {
    return this.fileService.getSubmissionFiles(submissionUUID);
  }

  // @Get('download/:file_name')
  // @RequiredRoles(Roles.Teacher, Roles.Student)
  // downloadFile(
  //   @Param('file_name') file_name: string,
  //   @Response({ passthrough: true }) response: IResponse,
  // ): any {
  //   const filePath = path.join(__dirname, `../../../uploads/${file_name}`);
  //   console.log('JOIN', filePath);
  //   // const file = createReadStream(filePath);
  //   const buffer = readFileSync(filePath);

  //   response.set({
  //     'Content-Type': 'application/json',
  //     'Content-Disposition': 'attachment; filename="package.json"',
  //   });

  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);

  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }

  //   // return btoa(binary);
  //   return buffer;
  //   // return new StreamableFile(file);
  // }

  @Get('download/submissions/:file_name')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async downloadSubmission(
    @Param('file_name') file_name: string,
    @Response({ passthrough: true }) response: IResponse,
  ): Promise<any> {
    const filePath = path.join(__dirname, `../../../submissions/${file_name}`);
    console.log('JOIN', filePath);
    // const file = createReadStream(filePath);
    const buffer = await readFile(filePath);
    // response.download(filePath);
    // const file = createReadStream(filePath);

    // response.writeHead(200, {
    //   'Content-Type': 'application/octet-stream',
    //   'Content-Disposition': `attachment; filename="${
    //     file_name.split('_')[2]
    //   }"`,
    // });

    // file.pipe(response);
    // return;
    // console.log('res', response);

    // response.set({
    //   'Content-Type': 'application/json',
    //   'Content-Disposition': 'attachment; filename="package.json"',
    // });

    let binary = '';
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // return response.send(file).status(200);
    return btoa(binary);
    // return buffer;
    // return new StreamableFile(file);
  }

  @Get('download/:file_name')
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async downloadFile(
    @Param('file_name') file_name: string,
    @Response({ passthrough: true }) response: IResponse,
  ): Promise<any> {
    const filePath = path.join(__dirname, `../../../uploads/${file_name}`);
    console.log('JOIN', filePath);
    // const file = createReadStream(filePath);
    const buffer = await readFile(filePath);
    // response.download(filePath);
    // const file = createReadStream(filePath);

    // response.writeHead(200, {
    //   'Content-Type': 'application/octet-stream',
    //   'Content-Disposition': `attachment; filename="${
    //     file_name.split('_')[2]
    //   }"`,
    // });

    // file.pipe(response);
    // return;
    // console.log('res', response);

    // response.set({
    //   'Content-Type': 'application/json',
    //   'Content-Disposition': 'attachment; filename="package.json"',
    // });

    let binary = '';
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // return response.send(file).status(200);
    return btoa(binary);
    // return buffer;
    // return new StreamableFile(file);
  }

  // @Post('upload/teacher')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }], multerConfigTeacher))
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
