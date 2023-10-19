import * as bcrypt from 'bcrypt';
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
    const payload = { email: user.email };

    return {
      email: user.email,
      accessToken: this._jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '60s',
      }),
      refreshToken: this._jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      uuid: user.uuid,
      email: user.email,
    };

    return {
      accessToken: this._jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '60s',
      }),
    };
  }
}
