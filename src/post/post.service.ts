import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { v4 as uuid } from 'uuid';
import { category } from './status/status copy';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private _postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const postId = uuid();
    const createdPost = await this._postModel.create<Post>({
      ...createPostDto,
      postId,
    });
    return createdPost;
  }

  async fetchPosts() {
    try{
    // Use the model to find all records, limit the result to 50, and sort by date in descending order
    return this._postModel
      .find()
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

  async findPostsByTag(tagForSerch: string) {
    try {
      const posts = await this._postModel.find({ tags: tagForSerch });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  async findPostsByCategory(categoryForSerch: category) {
    try {
      const posts = await this._postModel.find({ categories: categoryForSerch });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  async findPostsByPostalCode(postalCodeForSerch: string) {
    try {
      const posts = await this._postModel.find({ PostalCode: postalCodeForSerch });
      return posts;
    } catch (error) {
      console.log(error);
    }
  } 

  async searchPostsByTitle(titleForSerch: string) {
    const regex = new RegExp(titleForSerch, 'i'); // 'i' makes the search case-insensitive
    try {
    const posts = await this._postModel.find({ title: { $regex: regex } }).exec();
    return posts;
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
