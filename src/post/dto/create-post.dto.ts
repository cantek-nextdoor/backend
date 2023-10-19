export class CreatePostDto {
  postId: string;
  title: string;
  imageUrl: string;
  description: string;
  tag: [string];
  points: number;
  userId: string;
  numOfLike: number;
  postedDate: Date;
  dueDate: Date;
  completed: boolean;
  likedUserList: [string];
}
