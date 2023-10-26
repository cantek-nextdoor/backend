import { status } from '../status/status';
import { category } from '../status/categories';

export class CreatePostDto {
  postId: string;
  title: string;
  imageUrl: string[];
  description: string;
  tags: string[];
  points: number;
  userId: string;
  numOfLike: number;
  postedDate: Date;
  status: status;
  likedUserList: string[];
  latitude: number;
  longitude: number;
  categories: category;
  eventDateAndTime: Date;
  postalCode: string; 
}
