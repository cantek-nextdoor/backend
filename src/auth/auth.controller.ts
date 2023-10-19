import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    console.log('logging in...');
    return this._authService.login(signInDto);
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
