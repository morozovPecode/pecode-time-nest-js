import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SubActivityQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  activity_id: number | undefined;
}
