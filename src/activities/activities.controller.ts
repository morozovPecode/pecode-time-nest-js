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
  ActivityPayload,
  ActivityResponse,
  ActivityUpdatePayload,
} from './dtos';
import { PaginationQuery, IdParam } from 'src/lib/dtos';

const HARDCODED_ACTIVITY: ActivityResponse = {
  id: 1,
  group: {
    id: 1,
    name: 'Internal Activities',
  },
  name: 'Education',
};

@Controller('activities')
export class ActivitiesController {
  @Post('/')
  @Serialize(ActivityResponse)
  create(@Body() payload: ActivityPayload) {
    return HARDCODED_ACTIVITY;
  }

  @Get('/:id')
  @Serialize(ActivityResponse)
  getById(@Param() { id }: IdParam) {
    return HARDCODED_ACTIVITY;
  }

  @Patch('/:id')
  @Serialize(ActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityUpdatePayload) {
    return HARDCODED_ACTIVITY;
  }

  @Get('/')
  @SerializeList(ActivityResponse)
  list(@Query() pagination: PaginationQuery) {
    return {
      next: null,
      previous: null,
      count: 1,
      results: [HARDCODED_ACTIVITY],
    };
  }

  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {}
}
