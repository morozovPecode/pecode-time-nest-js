import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
