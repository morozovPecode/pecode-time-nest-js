import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './services';
import {
  SignInPayload,
  SignUpPayload,
  VerificationCodeRequestPayload,
} from './dtos';
import { RefreshToken } from './decorators';

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

  @Post('/signin')
  async signin(
    @Body() payload: SignInPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.signin(payload);
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

  @Post('/refresh')
  async refresh(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.service.refreshAccessToken(refreshToken);
    this.setCookies(res, tokens);

    return { success: true };
  }

  @Post('/logout')
  async logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.service.logout(refreshToken);
  }

  @Post('/logout-all')
  async logoutAll(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.service.logoutAll(refreshToken);
  }
}
