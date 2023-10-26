import { CreateActivityDto } from './dto/create-activity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { v4 as uuid } from 'uuid';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private _activityModel: Model<ActivityDocument>,
    @InjectConnection() private readonly connection: Connection, // Inject the MongoDB connection
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activityId = uuid();
    const createdActivity = await this._activityModel.create<Activity>({
      ...createActivityDto,
      activityId,
    });
    return createdActivity;
  }

  async findActivitysByUserId(userID: string) {
    try {
      const activitys = await this._activityModel.find({ userId: userID });
      return activitys;
    } catch (error) {
      console.log(error);
    }
  }

  async findActivitysByActivityId(activityId: string) {
    try {
      const activitys = await this._activityModel.find({ activityId: activityId });
      return activitys;
    } catch (error) {
      console.log(error);
    }
  }

  async findActivitysByTag(tagForSerch: string) {
    try {
      const activitys = await this._activityModel.find({ tag: tagForSerch });
      return activitys;
    } catch (error) {
      console.log(error);
    }
  }

  async updateActivity(activityId: string, updateActivityDto: UpdateActivityDto) {
    try {
      const updateResult = await this._activityModel.updateOne(
        { activityId: activityId },
        updateActivityDto,
      );
      return updateResult;
    } catch (error) {
      console.log(error);
    }
  }

  async addLikedUser(userId: string, activityId: string) {
    try {
      const activity = await this._activityModel
        .findOne({ activityId: activityId })
        .select('likedUserList')
        .exec();

      if (activity) {
        const likedUsers = activity.likedUserList;
        likedUsers.push(userId);
        const updateResult = await this._activityModel.updateOne(
          { activityId: activityId },
          { likedUserList: likedUsers },
        );
        return updateResult;
      } else {
        console.log('Activity not found.');
        return null; // or handle the case where the activity is not found
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeLikedUser(userId: string, activityId: string) {
    try {
      const activity = await this._activityModel
        .findOne({ activityId: activityId })
        .select('likedUserList')
        .exec();

      if (activity) {
        const likedUsers = activity.likedUserList;
        if (likedUsers.includes(userId)) {
          const updatedList = likedUsers.filter(
            (element) => element !== userId,
          );
          const updateResult = await this._activityModel.updateOne(
            { activityId: activityId },
            { likedUserList: updatedList },
          );
          return updateResult;
        } else {
          console.log('user not found.');
        }
      } else {
        console.log('Activity not found.');
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteActivity(activityId: string) {
    try {
      const deleteResult = await this._activityModel.deleteOne({ activityId: activityId });
      return deleteResult;
    } catch (error) {
      console.log(error);
    }
  }

  async insertImages(images : Express.Multer.File[]){
    const bucket = new GridFSBucket(this.connection.db);

    for (const image of images) {
      const uploadStream = bucket.openUploadStream(image.originalname);
      const bufferStream = Readable.from(image.buffer);

      bufferStream.pipe(uploadStream);
    }

    return 'Images uploaded successfully';
  }
}
