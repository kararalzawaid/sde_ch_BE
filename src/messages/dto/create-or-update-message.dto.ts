import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @ApiProperty({
    description: 'Text of the message',
    example: 'test'
  })
  text!: string;
}
