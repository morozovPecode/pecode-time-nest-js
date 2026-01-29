import { PickType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class SubActivityPayload {
  @IsString()
  name: string;

  @IsInt()
  activity_id: number;
}

export class SubActivityUpdatePayload extends PickType(SubActivityPayload, [
  'name',
]) {}
