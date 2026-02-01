import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/lib/decorators';
import { User } from './entities';
import { Serialize } from 'src/lib/interceptors';
import { UserResponse } from './dtos/UserResponse.dto';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard)
  @Serialize(UserResponse)
  @Get('/me')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
