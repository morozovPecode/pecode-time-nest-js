import { PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ActivityPayload {
  @IsString()
  name: string;

  @IsInt()
  group_id: number;
}

export class ActivityUpdatePayload extends PartialType(ActivityPayload) {}
