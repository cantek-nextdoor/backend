import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { category } from './status/categories';

@Controller('post')
export class PostController {
  constructor(private _PostService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this._PostService.create(createPostDto);
  }

  @Get('/')
  async findPostById(@Query('postId') postId: string) {
    const foundPost = await this._PostService.findPostsByPostId(postId);
    return foundPost;
  }

//fetch 50 recent posts
  @Get('/all')
  async fetchPosts() {
    const PostList = await this._PostService.fetchPosts();
    return PostList;
  }

  @Get('/searchPosts/:userid')
  async findPostsByUserId(@Param('userid') userId: string) {
    const PostList = await this._PostService.findPostsByUserId(userId);
    return PostList;
  }

  @Get('/searchPosts/tag/:tag')
  async findPostsByTag(@Param('tag') tag: string) {
    const PostList = await this._PostService.findPostsByTag(tag);
    return PostList;
  }

  @Get('/searchPosts/category/:category')
   async findPostsByCategory(@Param('category') category: category) {
    const PostList = await this._PostService.findPostsByCategory(category);
    return PostList;
  }

  @Get('/searchPosts/postalcode/:postalcode')
  async findPostsByPostalCode(@Param('postalcode') PostalCode: string) {
   const PostList = await this._PostService.findPostsByPostalCode(PostalCode);
   return PostList;
 }

  @Get('/searchPosts/title/:title')
  async searchPostsByTitle(@Param('title') Title: string) {
   const posts = await this._PostService.searchPostsByTitle(Title);
   return posts;
 }

  @Patch('/update')
  async updatePost(
    @Query('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this._PostService.updatePost(postId, updatePostDto);
  }

  @Patch('/liked')
  async addLikedUser(
    @Query('userId') userId: string,
    @Query('postId') postId: string,
  ) {
    return this._PostService.addLikedUser(userId, postId);
  }

  @Patch('/unliked')
  async removeLikedUser(
    @Query('userId') userId: string,
    @Query('postId') postId: string,
  ) {
    return this._PostService.removeLikedUser(userId, postId);
  }

  @Delete('/delete')
  async deletePost(@Query('postId') postId: string) {
    return this._PostService.deletePost(postId);
  }
}
