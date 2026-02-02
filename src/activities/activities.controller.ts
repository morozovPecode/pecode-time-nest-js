import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { Serialize, SerializeList } from 'src/lib/interceptors';
import {
  ActivityPayload,
  ActivityResponse,
  ActivityUpdatePayload,
} from './dtos';
import { PaginationQuery, IdParam } from 'src/lib/dtos';
import { ActivitiesService } from './services';
import { AccessGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/lib/decorators';
import { User } from 'src/users/entities';

@UseGuards(AccessGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(@Inject(ActivitiesService) private service: ActivitiesService) {}

  @Post('/')
  @Serialize(ActivityResponse)
  create(@Body() payload: ActivityPayload) {
    return this.service.create(payload);
  }

  @Get('/:id')
  @Serialize(ActivityResponse)
  getById(@Param() { id }: IdParam) {
    return this.service.getById(id);
  }

  @Patch('/:id')
  @Serialize(ActivityResponse)
  update(@Param() { id }: IdParam, @Body() payload: ActivityUpdatePayload) {
    return this.service.update(id, payload);
  }

  @Get('/')
  @SerializeList(ActivityResponse)
  list(@Query() pagination: PaginationQuery, @CurrentUser() user: User) {
    return this.service.list(pagination);
  }

  @Delete('/:id')
  deleteById(@Param() { id }: IdParam) {
    return this.service.deleteById(id);
  }
}
