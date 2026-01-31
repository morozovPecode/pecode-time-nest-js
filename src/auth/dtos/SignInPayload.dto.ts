import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SignInPayload {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null,
  )
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
