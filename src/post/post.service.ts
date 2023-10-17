import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { v4 as uuid } from 'uuid';

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

  async findPostsByUserId(userID: string) {
    try{
    const posts = await this._postModel.find({ userId: userID });
    return posts;
    } catch (error) {
      console.log(error);
    }
  }

  // async findPostByTag(tag: string): Promise<Post | undefined> {
  //   return this._postModel.find({ tag });
  // }

  // async findPostByTag(tag: string): Promise<Post | undefined> {
  //   return this._postModel.findOne({ tag });
  // }

  // async updatePost(updatePostDto: UpdatePostDto) {
  //   return this._postModel.updateOne(
  //     { postID: updatePostDto.postId },
  //     updatePostDto,
  //   );
  // }

  // async findAll(): Promise<User[]> {
  //   return this._userModel.find().exec();
  // }
}
