import { Injectable, StreamableFile } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import {
  findFilesForId,
  findProfilePicturePathById,
  findSubmissionFilesForId,
} from './file.utils';
import { createReadStream, readFileSync } from 'fs';
import { Blob, File } from 'buffer';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  getActivityFiles(activity_uuid: string) {
    console.log('activity_uuid', activity_uuid);
    const filesPaths = findFilesForId(activity_uuid);

    console.log('path', filesPaths);
    if (!filesPaths) return [];
    // const file = createReadStream(filesPaths[0]);
    const filesBuffer = filesPaths.map((path: string) => {
      const buffer = readFileSync(path);
      const fileName = path.split('/')[path.split('/').length - 1];
      const [timestamp, uuid, name] = fileName.split('_');
      const [_, type] = name.split('.');

      return { buffer, name, type, timestamp, uuid };
    });

    const filesStringArray = [];
    filesBuffer.forEach(({ buffer, name, type, timestamp, uuid }: any) => {
      let binary = '';
      const bytes = new Uint8Array(buffer);

      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      filesStringArray.push({
        string: btoa(binary),
        name,
        type,
        timestamp,
        uuid,
      });
    });

    return filesStringArray;
  }

  getSubmissionFiles(submission_uuid: string) {
    console.log('submission_uuid', submission_uuid);
    const filesPaths = findSubmissionFilesForId(submission_uuid);

    console.log('path', filesPaths);
    if (!filesPaths) return [];
    // const file = createReadStream(filesPaths[0]);
    const filesBuffer = filesPaths.map((path: string) => {
      const buffer = readFileSync(path);
      const fileName = path.split('/')[path.split('/').length - 1];
      const [timestamp, activity_uuid, submission_uuid, name] =
        fileName.split('_');
      const [_, type] = name.split('.');

      console.log('path', path);

      return { buffer, name, type, timestamp, submission_uuid, activity_uuid };
    });

    const files = filesBuffer.map(
      ({ buffer }) => new File([buffer], 'file.png'),
    );

    const filesStringArray = [];
    filesBuffer.forEach(
      ({
        buffer,
        name,
        type,
        timestamp,
        activity_uuid,
        submission_uuid,
      }: any) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);

        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        filesStringArray.push({
          string: btoa(binary),
          name,
          type,
          timestamp,
          activity_uuid,
          submission_uuid,
        });
      },
    );

    return filesStringArray;
  }

  getProfilePicture(userId: number) {
    const filePath = findProfilePicturePathById(String(userId));
    if (!filePath) return null;

    const buffer = readFileSync(filePath);
    const fileName = filePath.split('/')[filePath.split('/').length - 1];
    const [timestamp, user_id, name] = fileName.split('_');
    const [_, type] = name.split('.');

    let binary = '';
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return {
      string: btoa(binary),
      name,
      type,
      timestamp,
      user_id,
    };
  }
}
