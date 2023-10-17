import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private _PostService: PostService) {}

  @Get("/")
  async findPostByPostId(@Query('postId') uuid: string) {
    console.log('Find post!: '+ uuid);
  }


  @Get('/searchPosts/:userid')
  async findUserAllPost(@Param('userid') userId: string) {
    const PostList = await this._PostService.findPostsByUserId(userId);
    console.log('PostList', PostList);
    return PostList;
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this._PostService.create(createPostDto);
  }

  // @Put(':email')
  // async update(
  //   @Param('email') email: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   await this._userService.updateUser(updateUserDto);
  //   return updateUserDto;
  // }
}
