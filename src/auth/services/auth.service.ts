import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
  randomUUID,
} from 'node:crypto';
import { SignInPayload, SignUpPayload } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities';
import { Repository } from 'typeorm';
import { AuthSession } from '../entities';
import { JwtService } from './jwt.service';

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
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AuthSession) private repo: Repository<AuthSession>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string) {
    const salt = randomBytes(16);
    const hash = await scryptAsync(password, salt, 32);

    return `${hash.toString('base64')}$${salt.toString('base64')}`;
  }

  private async verifyPassword(password: string, hashed: string) {
    const [hashBase64, saltBase64] = hashed.split('$');

    if (!saltBase64 || !hashBase64) return false;

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

  private async hashRefreshToken(token: string) {
    return createHmac('sha256', process.env.REFRESH_TOKEN_HASH_SECRET!)
      .update(token)
      .digest('base64url');
  }

  private async verifyRefreshTokenHash(token: string, tokenHash: string) {
    const computed = await this.hashRefreshToken(token);

    const a = Buffer.from(computed);
    const b = Buffer.from(tokenHash);

    return a.length === b.length && timingSafeEqual(a, b);
  }

  private async initializeUserSession(user: User) {
    const sessionId = randomUUID();
    const refreshToken = this.jwtService.signRefresh({
      session_id: sessionId,
      user_id: user.id,
    });

    const refreshHash = await this.hashRefreshToken(refreshToken);

    const authSession = this.repo.create({
      id: sessionId,
      user_id: user.id,
      refresh_hash: refreshHash,
    });

    await this.repo.save(authSession);

    const accessToken = this.jwtService.signAccess({
      id: user.id,
      email: user.email,
      session_id: sessionId,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
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

    return this.initializeUserSession(user);
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

    return this.initializeUserSession(user);
  }

  public async refreshAccessToken(refreshToken: string) {
    const { session_id, user_id } = this.jwtService.verifyRefresh(refreshToken);

    const user = await this.userRepo.findOneBy({ id: user_id });

    if (!user) {
      throw new UnauthorizedException();
    }

    const authSession = await this.repo.findOneBy({ id: session_id, user_id });

    if (!authSession) {
      throw new UnauthorizedException();
    }

    const isValid = await this.verifyRefreshTokenHash(
      refreshToken,
      authSession.refresh_hash,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const newRefreshToken = this.jwtService.signRefresh({
      session_id,
      user_id,
    });
    const newRefreshHash = await this.hashRefreshToken(newRefreshToken);

    await this.repo.save({ ...authSession, refresh_hash: newRefreshHash });

    const accessToken = this.jwtService.signAccess({
      id: user.id,
      email: user.email,
      session_id,
    });

    return { access_token: accessToken, refresh_token: newRefreshToken };
  }

  public async logout(refresh_token: string) {
    const { session_id } = this.jwtService.verifyRefresh(refresh_token);

    await this.repo.delete({ id: session_id });

    return { success: true };
  }

  public async logoutAll(refresh_token: string) {
    const { user_id } = this.jwtService.verifyRefresh(refresh_token);

    await this.repo.delete({ user_id });

    return { success: true };
  }
}
