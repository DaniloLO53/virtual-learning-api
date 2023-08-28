import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ActivityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/)
  deadline: string;

  @IsNotEmpty()
  file: any;
}
