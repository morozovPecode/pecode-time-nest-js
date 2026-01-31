import { IsEmail, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpPayload {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : null,
  )
  @IsEmail()
  email: string;

  // Зазвичай додають додаткову кастомну валідацію на
  // складність паролю
  @IsString()
  password: string;

  @IsInt()
  code: number;
}
