import * as dotenv from 'dotenv';
import { AUTH_ACCESS_TOKEN_EXPIRY } from './auth.constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RefreshJwtStrategy } from './strategies/jwt-refresh-strategy';
import { UserModule } from '../user/user.module';

dotenv.config();

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: `${process.env.JWT_SECRET}`,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
