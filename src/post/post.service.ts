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

  async findPostsByPostId(postId: string) {
    try{
    const posts = await this._postModel.find({ postId: postId });
    console.log(posts)
    return posts;
    } catch (error) {
      console.log(error);
    }
  }

  async findPostByTag(tagForSerch: string){
    try{
      const posts = await this._postModel.find({ tag: tagForSerch });
      console.log(posts)
      return posts;
      } catch (error) {
        console.log(error);
      }
    }



  async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    try{
    const updateResult =  await 
    this._postModel.updateOne(
      {postId: postId},
      updatePostDto,
    );
    console.log(updateResult);
    return updateResult;
    } catch (error) {
    console.log(error);
    }
  }

  async deletePost(postId: string) {
    try{
    const deleteResult =  await 
    this._postModel.deleteOne(
      {postId: postId}
    );
    console.log(deleteResult);
    return deleteResult;
    } catch (error) {
    console.log(error);
    }
  }

  // async findAll(): Promise<User[]> {
  //   return this._userModel.find().exec();
  // }
}
