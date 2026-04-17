import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdateMessageDto {
  // isEnum validator to ensure that the tag is one of the allowed tags better that IsString() with values 0,1 and 2
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
