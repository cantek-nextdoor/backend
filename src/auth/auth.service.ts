import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private _userService: UserService) {}

  // async signIn(username: string, pass: string): Promise<any> {
  //   const user = await this._userService.findOne(username);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //
  //   console.log('user found');
  //   const { password, ...result } = user;
  //   // TODO: Generate a JWT and return it here
  //   // instead of the user object
  //   return result;
  // }
}
