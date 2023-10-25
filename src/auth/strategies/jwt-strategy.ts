import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/user.service';

dotenv.config();

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private _userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(req, payload: any) {
    return payload;
  }
}
