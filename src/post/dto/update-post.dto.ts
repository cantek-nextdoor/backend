import { status } from '../status/status';
import { category } from '../status/categories';

export class UpdatePostDto {
  postId: string;
  title: string;
  imageUrl: string[];
  description: string;
  tags: string[];
  points: number;
  postedDate: Date;
  status: status;
  likedUserList: string[];
  latitude: number;
  longtitude: number;
  categories: category;
  eventDateAndTime: Date;
  postalCode: string;
}
