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
import { SubActivitiesService } from './services';

@Controller('sub-activities')
export class SubActivitiesController {
  constructor(private service: SubActivitiesService) {}

  @Post('/')
  @Serialize(SubActivityResponse)
  create(@Body() payload: SubActivityPayload) {
    return this.service.create(payload);
  }

  @Get('/:id')
  @Serialize(SubActivityResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  @Patch('/:id')
  @Serialize(SubActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: SubActivityUpdatePayload) {
    return this.service.update(id, payload);
  }

  @Get('/')
  @SerializeList(SubActivityResponse)
  list(
    @Query() { activity_id }: SubActivityQuery,
    @Query() pagination: PaginationQuery,
  ) {
    return this.service.list(pagination, activity_id);
  }

  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
