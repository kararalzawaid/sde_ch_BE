import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '@users/dto/create-user.dto';

export class LoginUserDto extends OmitType(CreateUserDto, [
  'username'
] as const) {}
