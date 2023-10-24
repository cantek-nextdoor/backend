import { status } from '../status/status';

export class UpdatePostDto {
  postId: string;
  title: string;
  imageUrl: string;
  description: string;
  tags: string[];
  points: number;
  postedDate: Date;
  eventDate: Date;
  status: status;
  likedUserList: string[];
}
