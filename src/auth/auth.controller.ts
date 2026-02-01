import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './services';
import {
  SignInPayload,
  SignUpPayload,
  VerificationCodeRequestPayload,
} from './dtos';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signup(
    @Body() payload: SignUpPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.service.signup(payload);
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { success: true };
  }

  @Post('/signin')
  async signin(
    @Body() payload: SignInPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.service.signin(payload);
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { success: true };
  }

  @Post('/verification-code')
  async sendVerificationCode(
    @Body() { email }: VerificationCodeRequestPayload,
  ) {
    return this.service.sendVerificationCode(email);
  }
}
