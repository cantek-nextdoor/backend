import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const id = uuid();
    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this._userModel.create<User>({
      ...createUserDto,
      password: encryptedPassword,
      id,
    });
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
