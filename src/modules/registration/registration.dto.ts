import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @IsNumber()
  course_id: number;

  @IsNotEmpty()
  @IsNumber()
  student_id: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
