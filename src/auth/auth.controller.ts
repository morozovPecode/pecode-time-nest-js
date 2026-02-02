import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './services';
import {
  SignInPayload,
  SignUpPayload,
  VerificationCodeRequestPayload,
} from './dtos';
import { RefreshToken } from './decorators';
import { LocalAuthGuard, RefreshGuard } from './guards';
import { CurrentUser, SessionId } from 'src/lib/decorators';
import { User } from 'src/users/entities';
import type { UUID } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  private setCookies(
    res: Response,
    {
      access_token,
      refresh_token,
    }: {
      access_token: string;
      refresh_token: string;
    },
  ) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('refresh_token', { path: '/auth' });
    res.clearCookie('access_token', { path: '/' });
  }

  @Post('/signup')
  async signup(
    @Body() payload: SignUpPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.signup(payload);
    this.setCookies(res, tokens);

    return { success: true };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(
    @Body() _: SignInPayload,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.initializeUserSession(user);
    this.setCookies(res, tokens);

    return { success: true };
  }

  @Post('/verification-code')
  async sendVerificationCode(
    @Body() { email }: VerificationCodeRequestPayload,
  ) {
    await this.service.sendVerificationCode(email);
    return { success: true };
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(
    @CurrentUser() user: User,
    @SessionId() session_id: UUID,
    @RefreshToken() refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.refreshAccessToken(refresh_token, {
      user,
      session_id,
    });
    this.setCookies(res, tokens);

    return { success: true };
  }

  @UseGuards(RefreshGuard)
  @Post('/logout')
  async logout(
    @SessionId() session_id: UUID,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.service.logout(session_id);
  }

  @UseGuards(RefreshGuard)
  @Post('/logout-all')
  async logoutAll(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.service.logoutAll(user.id);
  }
}
