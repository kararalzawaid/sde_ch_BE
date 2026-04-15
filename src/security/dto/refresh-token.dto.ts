import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'some refresh token idk...',
    example: '1234asdasdblavbla'
  })
  refreshToken!: string;
}
