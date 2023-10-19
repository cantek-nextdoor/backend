import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserAccount } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    console.log('req.user.email', req.user.email);
    let user = req.user;
    console.log('user', user);
    const existingUser = await this._userService.findUserByProps({
      email: req.user.email,
    });
    console.log('existingUser', existingUser);
    if (existingUser && existingUser.user_type !== UserAccount.GOOGLE) {
      throw new BadRequestException(
        'Account already exists. Please sign in with your email and password.',
      );
    } else if (!existingUser) {
      console.log('Creating Google user');
      user = await this._userService.createGoogleUser(req.user);
    }

    user = this._authService.signJwt(user);
    res.set('authorization', user.accessToken);
    res.json(user);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    console.log('logging in...');
    return this._authService.signJwt(signInDto);
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this._userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refrshToken(@Request() req) {
    return this._authService.refreshToken(req.user);
  }
}
