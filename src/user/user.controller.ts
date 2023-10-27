import { AuthService } from '../auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
  async getUserDetails(@Param('_id') uuid: string , @Response() res) {
    const user = await this._userService.findUserByProps(
      { uuid },
      { password: 0 },
    );
    createJsonResponse(res, user);
  }

  @Get('ranking/top10')
  async getTopTenRankedUser(@Response() res) {
    const users = (await this._userService.getTopTenRankedUsers())[0];
    createJsonResponse(res, users);
  }
  
  @Get('ranking/:userid')
  async getRankedUsersPosition(@Param('userid') userid : string) {
    const userPosition = (await this._userService.getRankedUsersPosition(userid));
    console.log("userRankingPosition: ",userPosition);
    return {userPosition}
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

  @Patch('liked/:postid')
  async addLikePostId(
    @Param('postid') postId: string,
    @Param('userid') userId: string,
  ) {
    const user = await this._userService.addLikedPostId(userId, postId);
    return user;
  }

  @Patch('liked/:postid')
  async removeLikePostId(
    @Param('postid') postId: string,
    @Param('userid') userId: string,
  ) {
    const user = await this._userService.removeLikedPostId(userId, postId);
    return user;
  }
}
