import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'node:fs';
import { findProfilePicturePathById } from './file.utils';

@Injectable()
export class EraseFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Deleting file...');

    const request = context.switchToHttp().getRequest();

    const { id } = request.user;

    const oldProfilePicturePath = findProfilePicturePathById(String(id));

    if (oldProfilePicturePath) {
      fs.unlink(oldProfilePicturePath, (err) => {
        if (err) throw err;
        console.log(oldProfilePicturePath, ' was deleted');
      });
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
