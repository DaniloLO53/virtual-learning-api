import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RequiredRoles } from 'src/decorators/roles.decorator';
import { Roles } from '../user/user.enums';
import { CreateMessageDto } from './dto/createMessageDto';
import { MessageService } from './message.service';

@Controller('messages/:courseId')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() request: any,
    @Param('courseId') course_id: string,
  ) {
    const user = request.user;
    return await this.messageService.create({
      ...createMessageDto,
      course_id,
      user_id: user.id,
    });
  }

  @Get()
  @RequiredRoles(Roles.Teacher, Roles.Student)
  async getMessages(
    @Request() request: any,
    @Param('courseId') course_id: string,
  ) {
    const user = request.user;

    return await this.messageService.getMessages({ course_id });
  }
}
