import * as bcrypt from 'bcrypt';
import {
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
} from './auth.constant';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this._userService.findUserByProps({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signJwt(user: SignInDto) {
    const userInfo = await this._userService.findUserByProps(
      { email: user.email },
      { password: 0 },
    );

    return {
      email: user.email,
      accessToken: this._jwtService.sign(userInfo, {
        secret: process.env.JWT_SECRET,
        expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
      }),
      refreshToken: this._jwtService.sign(userInfo, {
        secret: process.env.JWT_SECRET,
        expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
      }),
    };
  }

  async refreshToken(user: User) {
    const userInfo = await this._userService.findUserByProps(
      { email: user.email },
      { password: 0 },
    );

    return {
      accessToken: this._jwtService.sign(userInfo, {
        secret: process.env.JWT_SECRET,
        expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
      }),
    };
  }

  setTokensToCookies(res, tokenDetails) {
    res.cookie('accessToken', tokenDetails.accessToken, {
      maxAge: 60 * 1000,
    });
    res.cookie('refreshToken', tokenDetails.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
