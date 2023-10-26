import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityService } from './activity.service';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('activity')
export class ActivityController {
  constructor(private _ActivityService: ActivityService) {}

  @Post()
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this._ActivityService.create(createActivityDto);
  }

  @Get('/:activityId')
  async findActivityById(@Param('activityId') activityId: string) {
    const foundActivity = await this._ActivityService.findActivitysByActivityId(activityId);
    return foundActivity;
  }

  //search ALL activity related with one user id
  @Get('/searchActivitys/:userid')
  async findActivitysByUserId(@Param('userid') userId: string) {
    const ActivityList = await this._ActivityService.findActivitysByUserId(userId);
    return ActivityList;
  }

  //search ALL activity belong to one tag
  @Get('/searchActivitys/:tag')
  async findActivitysByTag(@Param('tag') tag: string) {
    const ActivityList = await this._ActivityService.findActivitysByTag(tag);
    return ActivityList;
  }

  @Patch('/update')
  async updateActivity(
    @Query('activityId') activityId: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this._ActivityService.updateActivity(activityId, updateActivityDto);
  }

  @Patch('/liked')
  async addLikedUser(
    @Query('userId') userId: string,
    @Query('activityId') activityId: string,
  ) {
    return this._ActivityService.addLikedUser(userId, activityId);
  }

  @Patch('/unliked')
  async removeLikedUser(
    @Query('userId') userId: string,
    @Query('activityId') activityId: string,
  ) {
    return this._ActivityService.removeLikedUser(userId, activityId);
  }

  @Delete('/delete')
  async deleteActivity(@Query('activityId') activityId: string) {
    return this._ActivityService.deleteActivity(activityId);
  }

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(@UploadedFiles() images: Express.Multer.File[]) {
    return this._ActivityService.insertImages(images);
}
}
