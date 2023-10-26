import { status } from '../status/status';

export class CreateActivityDto {
  activityId: string;
  title: string;
  imageUrl: string[];
  description: string;
  tags: string;
  points: number;
  userId: string;
  numOfLike: number;
  postedDate: Date;
  eventDateAndTime: Date;
  status: status;
  location: string;
  likedUserList: string[];
}
