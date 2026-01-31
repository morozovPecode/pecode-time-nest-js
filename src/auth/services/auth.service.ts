import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { SignInPayload, SignUpPayload } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities';
import { Repository } from 'typeorm';

export function scryptAsync(
  password: string,
  salt: Buffer,
  keyLen: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLen, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  private async hashPassword(password: string) {
    const salt = randomBytes(16);
    const hash = await scryptAsync(password, salt, 32);

    return `${hash.toString('base64')}$${salt.toString('base64')}`;
  }

  private async verifyPassword(password: string, hashed: string) {
    const [hashBase64, saltBase64] = hashed.split('$');

    const salt = Buffer.from(saltBase64, 'base64');
    const expected = Buffer.from(hashBase64, 'base64');

    const provided = await scryptAsync(password, salt, expected.length);

    return timingSafeEqual(provided, expected);
  }

  private async createVerificationCode(email: string) {
    // Тут створюється код верифікації (OTP)
    // і далі кладеться, наприклад в redis, як key-value пара
    // email-у та коду із певним expiration time (напр. 5 хвилин)
    return new Promise<number>((resolve) => {
      resolve(123456);
    });
  }

  private async verifyCode(email: string, code: number) {
    // Перевіряємо чи є в redis-і для юзера з даним email такий код
    return true;
  }

  public async sendVerificationCode(email: string) {
    const code = await this.createVerificationCode(email);
    // Тут за допомогою якогось провайдера по відправці email-ів
    // відправляється лист з кодом

    return;
  }

  public async signup(data: SignUpPayload) {
    const isValidCode = await this.verifyCode(data.email, data.code);

    if (!isValidCode) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const isDuplicate = await this.userRepo.existsBy({ email: data.email });

    if (isDuplicate) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const _user = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
    });

    const user = await this.userRepo.save(_user);

    return user;
  }

  public async signin(data: SignInPayload) {
    const user = await this.userRepo.findOneBy({ email: data.email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isEqualPasswords = await this.verifyPassword(
      data.password,
      user.password,
    );

    if (!isEqualPasswords) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
