import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tag of the message',
    example: 'test'
  })
  tag!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(240, { message: 'Text must be less than 240 characters' })
  @ApiProperty({
    description: 'Text of the message',
    example: 'test'
  })
  text!: string;
}
