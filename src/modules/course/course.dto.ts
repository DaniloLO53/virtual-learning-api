import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  id: number;

  @IsString()
  password: string;

  @IsBoolean()
  opened: boolean;
}
