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
import { ActivityGroupsService } from './services';

@Controller('activity-groups')
export class ActivityGroupsController {
  constructor(private service: ActivityGroupsService) {}

  @Post('/')
  @Serialize(ActivityGroupResponse)
  create(@Body() payload: ActivityGroupPayload) {
    return this.service.create(payload);
  }

  @Get('/:id')
  @Serialize(ActivityGroupResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  @Patch('/:id')
  @Serialize(ActivityGroupResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityGroupPayload) {
    return this.service.update(id, payload);
  }

  @Get('/')
  @SerializeList(ActivityGroupResponse)
  list(@Query() pagination: PaginationQuery) {
    return this.service.list(pagination);
  }

  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
