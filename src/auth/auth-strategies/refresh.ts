import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { cookieExtractor } from '../helpers';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/services';
import { AuthContext } from './types';

type RefreshPayload = { session_id: UUID; user_id: number };

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor('refresh_token'),
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET!,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate({ user_id, session_id }: RefreshPayload): Promise<AuthContext> {
    const user = await this.usersService.findById(user_id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { user, session_id };
  }
}