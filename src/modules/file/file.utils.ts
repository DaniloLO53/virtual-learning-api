import { readdirSync } from 'fs';
import * as path from 'path';

export function findFilesForId(id: string) {
  // console.log('path', path);
  const directoryPath = path.join(__dirname, '../../../uploads');
  const files = readdirSync(directoryPath);

  const matchingFiles = files.filter((file) => {
    const fileId = file.split('_')[1];
    return fileId === id;
  });

  // console.log('matchingFiles', matchingFiles);
  // console.log('files', files);

  const filesPath = [];
  if (matchingFiles.length > 0) {
    matchingFiles.forEach((matchingFile: any) =>
      filesPath.push(path.join(directoryPath, matchingFile)),
    );
    // console.log('filesPath', filesPath);
    return filesPath;
  }

  return null;
}

export function findSubmissionFilesForId(id: string) {
  // console.log('path', path);
  const directoryPath = path.join(__dirname, '../../../submissions');
  const files = readdirSync(directoryPath);

  const matchingFiles = files.filter((file) => {
    const fileId = file.split('_')[2];
    return fileId === id;
  });

  // console.log('matchingFiles', matchingFiles);
  // console.log('files', files);

  const filesPath = [];
  if (matchingFiles.length > 0) {
    matchingFiles.forEach((matchingFile: any) =>
      filesPath.push(path.join(directoryPath, matchingFile)),
    );
    // console.log('filesPath', filesPath);
    return filesPath;
  }

  return null;
}
