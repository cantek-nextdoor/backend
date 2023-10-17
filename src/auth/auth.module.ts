import * as dotenv from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { Module } from '@nestjs/common';
import { RefreshJwtStrategy } from './strategies/refresh-token-strategy';
import { UserModule } from '../user/user.module';

dotenv.config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secretOrPrivateKey: `${process.env.JWT_SECRET}`,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    RefreshJwtStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
