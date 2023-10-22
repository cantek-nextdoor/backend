import * as bcrypt from 'bcrypt';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserAccount, UserDocument } from './schemas/user.schema';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const uuid = v4();
      const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
      const defaultUserInfo = {
        uuid,
        user_type: UserAccount.DEFAULT,
        password: encryptedPassword,
        postal_code: createUserDto.postal_code.toUpperCase().replace('-', ' '),
        points: 0,
        display_name: createUserDto.email.split('@')[0],
        likedPostList: [],
      };

      const payload = { ...createUserDto, ...defaultUserInfo };

      await this._userModel.create<User>({
        ...createUserDto,
        ...defaultUserInfo,
      });
      delete payload.password;
      return payload;
    } catch (e) {
      console.log('e', e);
      throw new UnprocessableEntityException({ status: 422, ...e });
    }
  }

  async createGoogleUser(
    createGoogleUserDto: CreateGoogleUserDto,
  ): Promise<User> {
    try {
      const uuid = v4();
      const defaultUserInfo = {
        uuid,
        user_type: UserAccount.GOOGLE,
        postal_code: 'M5J 1E6', // Union Station postal code
        points: 0,
        display_name: createGoogleUserDto.email.split('@')[0],
        likedPostList: [],
      };

      const payload = { ...createGoogleUserDto, ...defaultUserInfo };

      await this._userModel.create<User>({
        ...createGoogleUserDto,
        ...defaultUserInfo,
      });
      delete payload.password;
      return payload;
    } catch (e) {
      console.log('e', e);
      throw new UnprocessableEntityException({ status: 422, ...e });
    }
  }

  async findUserByProps(
    filter: Record<string, any>,
    projection?: Record<string, number>,
  ): Promise<User | undefined> {
    return this._userModel.findOne(filter, projection);
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    return this._userModel.updateOne(
      { email: updateUserDto.email },
      updateUserDto,
    );
  }
}
