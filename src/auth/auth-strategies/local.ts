import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services';
import type { User } from 'src/users/entities';
import { AuthContext } from './types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private service: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<AuthContext> {
    const user = await this.service.validateLocalUser({ email, password });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return { user };
  }
}
