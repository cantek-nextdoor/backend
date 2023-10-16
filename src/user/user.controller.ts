import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') uuid: string) {
    return `This action gets the user with ${uuid} uuid.`;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return `This action creates a new user.`;
    // return this._userService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return `This action updates the #${id} user`;
  }
}
