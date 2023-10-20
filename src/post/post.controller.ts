import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private _PostService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this._PostService.create(createPostDto);
  }


  @Get("/")
  async findPostByPostId(@Query('postId') postId: string) {
    const foundPost =  await this._PostService.findPostsByPostId(postId);
    return foundPost;
  }

  @Get('/searchPosts/:userid')
  async findUserAllPost(@Param('userid') userId: string) {
    const PostList = await this._PostService.findPostsByUserId(userId);
    return PostList;
  }

  @Get('/searchPosts/:tag')
  async findPostsByTag(@Param('tag') tag: string) {
    const PostList = await this._PostService.findPostByTag(tag);
    return PostList;
  }

  @Patch('/update')
  async updatePost(@Query('postId') postId: string ,  @Body() UpdatePostDto: UpdatePostDto) {
    return this._PostService.updatePost(postId, UpdatePostDto);
  }

  @Patch('/liked')
  async addLikedUser(@Query('userId') userId: string , @Query('postId') postId: string) {
    return this._PostService.addLikedUser(userId, postId);
  }

  @Patch('/unliked')
  async removeLikedUser(@Query('userId') userId: string , @Query('postId') postId: string) {
    return this._PostService.removeLikedUser(userId, postId);
  }

  @Delete('/delete')
  async deletePost(@Query('postId') postId: string) {
    return this._PostService.deletePost(postId);
  }

}
