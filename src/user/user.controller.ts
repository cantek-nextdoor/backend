import { AuthService } from '../auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}

  @Get('details/:_id')
  async getUserDetails(@Param('_id') _id: string) {
    const user = await this._userService.findUserByProps(
      { _id },
      { password: 0 },
    );
    console.log('user', user);
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('test')
  async testFunction(@Request() req) {
    console.log('Only users with valid access_token could access the endpoint');
    return req.user;
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    const user = await this._userService.findUserByProps({ email });
    console.log('user', user);
    return user;
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
