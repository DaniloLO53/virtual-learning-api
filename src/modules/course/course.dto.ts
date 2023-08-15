import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/[A-Z]{3}\d{3}/)
  code: string;

  @IsString()
  id: number;

  @IsString()
  password: string;

  @IsBoolean()
  opened: boolean;
}

export interface CourseQuery {
  query: string;
}
