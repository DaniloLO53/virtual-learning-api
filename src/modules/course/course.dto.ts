import { IsNotEmpty, IsString } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  id: number;
}
