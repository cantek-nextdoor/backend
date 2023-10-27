import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
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
import { createJsonResponse } from '../utils';

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
  @Redirect()
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    let user = req.user;
    const existingUser = await this._userService.findUserByProps({
      email: req.user.email,
    });
    if (existingUser && existingUser.userType !== UserAccount.GOOGLE) {
      throw new BadRequestException(
        'Account already exists. Please sign in with your email and password.',
      );
    } else if (!existingUser) {
      user = await this._userService.createGoogleUser(req.user);
    }
    const tokenDetails = await this._authService.signJwt(user);
    this._authService.setTokensToCookies(res, tokenDetails);
    return {
      url: process.env.CLIENT_URL + '/home' ?? 'http://localhost:5173/home',
    };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Request() req, @Response() res) {
    const tokenDetails = await this._authService.signJwt(signInDto);
    this._authService.setTokensToCookies(res, tokenDetails);
    createJsonResponse(res, { ...tokenDetails, ...req.user });
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto, @Response() res) {
    const user = await this._userService.createUser(createUserDto);
    const tokenDetails = await this._authService.signJwt(user);
    this._authService.setTokensToCookies(res, tokenDetails);
    createJsonResponse(res, { ...tokenDetails, ...user });
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Response() res) {
    const tokenDetails = await this._authService.refreshToken(req.user);
    res.cookie('accessToken', tokenDetails.accessToken, {
      maxAge: 60 * 1000,
    });
    createJsonResponse(res, tokenDetails);
  }
}
