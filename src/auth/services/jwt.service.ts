import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UUID } from 'node:crypto';
import { User } from 'src/users/entities';

type AccessPayload = Pick<User, 'id' | 'email'> & { session_id: UUID };
type RefreshPayload = { session_id: UUID; user_id: number };

@Injectable()
export class JwtService {
  constructor(private _jwtService: NestJwtService) {}

  signAccess({ id, email }: AccessPayload) {
    return this._jwtService.sign(
      { id, email },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '10s',
      },
    );
  }

  signRefresh({ session_id, user_id }: RefreshPayload) {
    return this._jwtService.sign(
      { session_id, user_id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '2m',
      },
    );
  }
}
