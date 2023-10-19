export class UpdatePostDto {
  postId: string;
  title: string;
  imageUrl: string;
  description: string;
  tag: [string];
  points: number;
  postedDate: Date;
  dueDate: Date;
  completed: boolean;
  likedUserList: [string];
}
