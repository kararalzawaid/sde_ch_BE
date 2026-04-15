import { ApiQuery } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request
} from '@nestjs/common';

import { Message } from '@messages/entities/message.entity';

import { MessagesService } from '@messages/messages.service';

import { GetMessagesQueryDto } from '@messages/dto/get-messages-query.dto';
import { CreateOrUpdateMessageDto } from '@messages/dto/create-or-update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  async create(
    @Request() req,
    @Body() createMessageDto: CreateOrUpdateMessageDto
  ): Promise<Message> {
    const userId = req?.user?.id;

    return this.messagesService.create(createMessageDto, userId);
  }

  @Get()
  // add swagger parameters here
  // to search after tag or date or userid
  // https://docs.nestjs.com/openapi/types-and-parameters
  @ApiQuery({ name: 'tag', type: String, required: false })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  @ApiQuery({ name: 'userId', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query() getMessagesQueryDto: GetMessagesQueryDto
  ): Promise<{ count: number; messages: Message[] }> {
    return this.messagesService.findAll(getMessagesQueryDto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string): Promise<void> {
    const userId = req?.user?.id;

    return this.messagesService.delete(id, userId);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMessageDto: CreateOrUpdateMessageDto
  ): Promise<void> {
    const userId = req?.user?.id;

    return this.messagesService.update(id, userId, updateMessageDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOne(id);
  }
}
