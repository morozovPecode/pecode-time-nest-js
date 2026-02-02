import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { cookieExtractor } from '../helpers';
import { User } from 'src/users/entities';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/services';
import { AuthContext } from './types';

type AccessPayload = Pick<User, 'id' | 'email'> & { session_id: UUID };

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor('access_token'),
      ]),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate({ id, email, session_id }: AccessPayload): Promise<AuthContext> {
    const user = await this.usersService.findById(id);

    if (!user || user.email !== email) {
      throw new UnauthorizedException();
    }

    return { user, session_id };
  }
}
