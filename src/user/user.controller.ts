import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  async findUserByEmail(@Param('id') uuid: string) {
    console.log('test');
    // const user = this._authService.signIn('abc@gmail.com', 'password');
    // console.log('user', user);
    // return user;
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    const user = await this._userService.findUser(email);
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this._userService.create(createUserDto);
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
