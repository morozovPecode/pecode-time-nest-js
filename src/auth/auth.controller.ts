import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './services';
import {
  SignInPayload,
  SignUpPayload,
  VerificationCodeRequestPayload,
} from './dtos';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/signup')
  async signup(@Body() payload: SignUpPayload) {
    const user = await this.service.signup(payload);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '7d',
    });
    return { token };
  }

  @Post('/signin')
  async signin(@Body() payload: SignInPayload) {
    const user = await this.service.signin(payload);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '7d',
    });
    return { token };
  }

  @Post('/verification-code')
  async sendVerificationCode(
    @Body() { email }: VerificationCodeRequestPayload,
  ) {
    return this.service.sendVerificationCode(email);
  }
}
