import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';
import { Roles } from '../user/user.enums';
import { Role } from '../user/user.types';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class TokenPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  id: number;

  @IsIn([Roles.Student, Roles.Teacher])
  role: Role;

  @IsNotEmpty()
  iat: number;

  @IsNotEmpty()
  exp: number;
}
