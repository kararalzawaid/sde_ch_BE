import { PaginationDto } from '@common/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsDate, IsUUID } from 'class-validator';

export class GetMessagesQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  tag?: string;

  // start date
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  // end date
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @IsString()
  @IsOptional()
  @IsUUID()
  userId?: string;
}
