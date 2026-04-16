import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { UsersService } from '@users/users.service';

import { CreateUserDto } from '@users/dto/create-user.dto';

import { Public } from '@security/decorators/public.decorator';
import { User } from '@users/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Public()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ id: string; email: string; username: string }> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete()
  async delete(): Promise<void> {
    return this.usersService.delete();
  }

  @Get('me')
  async me(@Request() req): Promise<User> {
    const userId = req?.user?.id;

    return this.usersService.findOne(userId);
  }
}
