import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService, JwtService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthSession } from './entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthSession]),
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [JwtService],
})
export class AuthModule {}
