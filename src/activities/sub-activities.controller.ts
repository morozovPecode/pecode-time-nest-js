import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { Serialize, SerializeList } from 'src/lib/interceptors';
import {
  SubActivityPayload,
  SubActivityResponse,
  SubActivityUpdatePayload,
  SubActivityQuery,
} from './dtos';
import { IdParam, PaginationQuery } from 'src/lib/dtos';

const HARDCODED_SUB_ACTIVITY: SubActivityResponse = {
  id: 1,
  name: 'NestJS learning',
  activity_id: 1,
};

@Controller('sub-activities')
export class SubActivitiesController {
  @Post('/')
  @Serialize(SubActivityResponse)
  create(@Body() payload: SubActivityPayload) {
    return HARDCODED_SUB_ACTIVITY;
  }

  @Get('/:id')
  @Serialize(SubActivityResponse)
  getById(@Param() { id }: IdParam) {
    return HARDCODED_SUB_ACTIVITY;
  }

  @Patch('/:id')
  @Serialize(SubActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: SubActivityUpdatePayload) {
    return HARDCODED_SUB_ACTIVITY;
  }

  @Get('/')
  @SerializeList(SubActivityResponse)
  list(
    @Query() { activity_id }: SubActivityQuery,
    @Query() pagination: PaginationQuery,
  ) {
    return {
      next: null,
      previous: null,
      count: 1,
      results: [HARDCODED_SUB_ACTIVITY],
    };
  }

  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {}
}
