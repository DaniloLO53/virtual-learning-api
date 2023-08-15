import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @IsNumber()
  course_id: number;

  @IsNotEmpty()
  @IsBoolean()
  student_id: number;

  @IsString()
  password: string;
}
