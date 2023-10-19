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
    console.log('Find post!: '+ postId);
    const foundPost =  await this._PostService.findPostsByPostId(postId);
    return foundPost;
  }

  @Get('/searchPosts/:userid')
  async findUserAllPost(@Param('userid') userId: string) {
    const PostList = await this._PostService.findPostsByUserId(userId);
    console.log('PostList', PostList);
    return PostList;
  }

  @Get('/searchPosts/:tag')
  async findPostsByTag(@Param('tag') tag: string) {
    const PostList = await this._PostService.findPostByTag(tag);
    console.log('PostList', PostList);
    return PostList;
  }

  @Patch('/update')
  async updatePost(@Query('postId') postId: string ,  @Body() UpdatePostDto: UpdatePostDto) {
    console.log('Update post id: '+postId);
    return this._PostService.updatePost(postId, UpdatePostDto);
  }

  @Delete('/delete')
  async deletePost(@Query('postId') postId: string) {
    console.log('Delete post id: '+postId);
    return this._PostService.deletePost(postId);
  }

}
