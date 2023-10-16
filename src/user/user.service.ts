import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this._userModel.create<User>(createUserDto);
    return createdUser;
  }

  async findUser(email: string): Promise<User | undefined> {
    return this._userModel.findOne({ email });
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    return this._userModel.updateOne(
      { email: updateUserDto.email },
      updateUserDto,
    );
  }

  // async findAll(): Promise<User[]> {
  //   return this._userModel.find().exec();
  // }
}
