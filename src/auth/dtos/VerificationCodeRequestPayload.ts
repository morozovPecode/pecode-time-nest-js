import { IsEmail } from 'class-validator';

export class VerificationCodeRequestPayload {
  @IsEmail()
  email: string;
}
