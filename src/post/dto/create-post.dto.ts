import { status } from "../status/status";

export class CreatePostDto {
  postId: string;
  title: string;
  imageUrl: string;
  description: string;
  tags: string[];
  points: number;
  userId: string;
  numOfLike: number;
  postedDate: Date;
  eventDate: Date;
  status: status;
  likedUserList: string[];
}
