import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { v4 as uuid } from 'uuid';
import { category } from './status/categories';
import { LocationService } from 'src/location/location.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private _postModel: Model<PostDocument>,
    private _locService: LocationService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const postId = uuid();
    const createdPost = await this._postModel.create<Post>({
      ...createPostDto,
      postId,
    });
    return createdPost;
  }

  async fetchPosts(postalCode: string, distance: number) {
    // Get all posts from nearby postal codes
    const nearbyCodes = this._locService.getNearbyPostalCodes(distance, postalCode);
    try {
      // Use the model to find all records, limit the result to 50, and sort by date in descending order
      return this._postModel
        .find({ postalCode: { $in: nearbyCodes } })
        .sort({ postedDate: -1 }) // -1 for descending order, 1 for ascending order
        .limit(50)
        .exec();
    } catch (error) {
      console.log(error);
    }
  }

  async findPostsByUserId(userID: string) {
    try {
      const posts = await this._postModel.find({ userId: userID });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  async findPostsByPostId(postId: string) {
    try {
      const posts = await this._postModel.find({ postId: postId });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  async findPostsByTag(tagForSearch: string) {
    try {
      const posts = await this._postModel.find({ tag: tagForSearch });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  async findPostsByCategory(categoryForSearch: category) {
    try {
      const posts = await this._postModel.find({ categories: categoryForSearch });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  async findPostsByPostalCode(postalCodeForSearch: string) {
    try {
      const posts = await this._postModel.find({ postalCode : postalCodeForSearch });
      return posts;
    } catch (error) {
      console.log(error);
    }
  } 

  async searchPostsByTitle(titleForSearch: string) {
    const regex = new RegExp(titleForSearch, 'i'); // 'i' makes the search case-insensitive
    try {
      const posts = await this._postModel.find({ title: { $regex: regex } }).exec();
      return posts;
    } catch (error) {
      console.log(error);
    }
  } 

  async searchNearbyEvents(postalCode: string, date : Date, distance : number) {
    try {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      const events = await this._postModel.find({ eventDateAndTime: { $gte: date, $lt: nextMonth },
                                                  categories : category.activity});
      
      const currPostalCode = await this._locService.findLocation(postalCode);

      const result = [];
      events.forEach((item) => {
        if (
          this._locService.calculateDistance(
            currPostalCode.latitude,
            currPostalCode.longtitude,
            item.latitude,
            item.longitude,
          ) <= distance
        ) {
          result.push(item);
        }
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  
  async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    try {
      const updateResult = await this._postModel.updateOne(
        { postId: postId },
        updatePostDto,
      );
      return updateResult;
    } catch (error) {
      console.log(error);
    }
  }

  async addLikedUser(userId: string, postId: string) {
    try {
      const post = await this._postModel
        .findOne({ postId: postId })
        .select('likedUserList')
        .exec();

      if (post) {
        const likedUsers = post.likedUserList;
        likedUsers.push(userId);
        const updateResult = await this._postModel.updateOne(
          { postId: postId },
          { likedUserList: likedUsers },
        );
        return updateResult;
      } else {
        console.log('Post not found.');
        return null; // or handle the case where the post is not found
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeLikedUser(userId: string, postId: string) {
    try {
      const post = await this._postModel
        .findOne({ postId: postId })
        .select('likedUserList')
        .exec();

      if (post) {
        const likedUsers = post.likedUserList;
        if (likedUsers.includes(userId)) {
          const updatedList = likedUsers.filter(
            (element) => element !== userId,
          );
          const updateResult = await this._postModel.updateOne(
            { postId: postId },
            { likedUserList: updatedList },
          );
          return updateResult;
        } else {
          console.log('user not found.');
        }
      } else {
        console.log('Post not found.');
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deletePost(postId: string) {
    try {
      const deleteResult = await this._postModel.deleteOne({ postId: postId });
      return deleteResult;
    } catch (error) {
      console.log(error);
    }
  }
}
