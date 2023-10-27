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
        userType: UserAccount.DEFAULT,
        password: encryptedPassword,
        postalCode: createUserDto.postalCode.toUpperCase().replace('-', ' '),
        points: 20,
        displayName: createUserDto.email.split('@')[0],
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
        userType: UserAccount.GOOGLE,
        postalCode: 'M5J 1E6', // Union Station postal code
        points: 20,
        displayName: createGoogleUserDto.email.split('@')[0],
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
    return this._userModel.findOne(filter, projection).lean();
  }

  async getTopTenRankedUsers(): Promise<User[] | undefined> {
    return this._userModel.aggregate([
      { $sort: { points: -1 } },
      { $limit: 10 },
      {
        $group: {
          _id: null,
          users: {
            $push: {
              uuid: '$uuid',
              displayName: '$displayName',
              points: '$points',
              postalCode: '$postalCode',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
    ]);
  }

  async getRankedUsersPosition(userId: string): Promise<number> {
    const sortedUsers = await this._userModel.find().sort({ points: -1 }).exec();
    const specificUser = sortedUsers.find(user => user.uuid.toString() === userId);
    const userRankingPosition = sortedUsers.indexOf(specificUser);
    return userRankingPosition + 1;
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    return this._userModel.updateOne(
      { uuid: updateUserDto.uuid },
      updateUserDto,
    );
  }

  async addLikedPostId(userId: string, postId: string) {
    console.log('added post id:', postId, 'for user: ', userId);
    try {
      const user = await this._userModel
        .findOne({ uuid: userId })
        .select('likedPostList')
        .exec();

      if (user) {
        const likedPosts = user.likedPostList;
        likedPosts.push(postId);
        const updateResult = await this._userModel.updateOne(
          { uuid: userId },
          { likedPostList: likedPosts },
        );
        return updateResult;
      } else {
        console.log('User not found.');
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeLikedPostId(userId: string, postId: string) {
    console.log('Removed post id:', postId, 'for user: ', userId);
    try {
      const user = await this._userModel
        .findOne({ uuid: userId })
        .select('likedPostList')
        .exec();

      if (user) {
        const likedPosts = user.likedPostList;
        if (likedPosts.includes(postId)) {
          const updatedList = likedPosts.filter(
            (element) => element !== postId,
          );
          const updateResult = await this._userModel.updateOne(
            { uuid: userId },
            { likedPostList: updatedList },
          );
          return updateResult;
        } else {
          console.log('Post not found.');
        }
      } else {
        console.log('User not found.');
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
