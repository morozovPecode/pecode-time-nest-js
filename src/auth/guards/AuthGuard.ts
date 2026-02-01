import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/services';
import { JwtService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // const authHeader = request.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   throw new UnauthorizedException();
    // }

    // const token = authHeader.split(' ')[1];

    // if (!token) {
    //   throw new UnauthorizedException();
    // }

    const token = request.cookies?.access_token

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { id, email } = this.jwtService.verifyAccess(token);

      const user = await this.usersService.findById(id);

      if (!user || user.email !== email) {
        throw new UnauthorizedException();
      }

      request['user'] = user;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
