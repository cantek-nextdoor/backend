import { AuthService } from '../auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { createJsonResponse } from '../utils';

@Controller('user')
export class UserController {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}

  @Get('details/:_id')
  async getUserDetails(@Param('_id') _id: string, @Response() res) {
    const user = await this._userService.findUserByProps(
      { _id },
      { password: 0 },
    );
    createJsonResponse(res, user);
  }

  @UseGuards(JwtGuard)
  @Get('test')
  async testFunction(@Request() req, @Response() res) {
    createJsonResponse(res, req.user);
  }

  @Get(':email')
  async findOne(@Param('email') email: string, @Response() res) {
    const user = await this._userService.findUserByProps({ email });
    createJsonResponse(res, user);
  }

  @Put(':email')
  async update(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this._userService.updateUser(updateUserDto);
    return updateUserDto;
  }
}
