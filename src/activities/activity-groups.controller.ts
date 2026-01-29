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
import { ActivityGroupResponse, ActivityGroupPayload } from './dtos';
import { IdParam, PaginationQuery } from 'src/lib/dtos';

const HARDCODED_ACTIVITY_GROUP: ActivityGroupResponse = {
  id: 1,
  name: 'Internal Activities',
};

@Controller('activity-groups')
export class ActivityGroupsController {
  @Post('/')
  @Serialize(ActivityGroupResponse)
  create(@Body() payload: ActivityGroupPayload) {
    return HARDCODED_ACTIVITY_GROUP;
  }

  @Get('/:id')
  @Serialize(ActivityGroupResponse)
  getById(@Param() { id }: IdParam) {
    return HARDCODED_ACTIVITY_GROUP;
  }

  @Patch('/:id')
  @Serialize(ActivityGroupResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityGroupPayload) {
    return HARDCODED_ACTIVITY_GROUP;
  }

  @Get('/')
  @SerializeList(ActivityGroupResponse)
  list(@Query() pagination: PaginationQuery) {
    return {
      next: null,
      previous: null,
      count: 0,
      results: [HARDCODED_ACTIVITY_GROUP],
    };
  }

  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {}
}
