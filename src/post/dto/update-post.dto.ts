export class UpdatePostDto {
  postId: string;
  title: string;
  imageUrl: string;
  description: string;
  tags: string[];
  points: number;
  postedDate: Date;
  dueDate: Date;
  completed: boolean;
  likedUserList: string[];
}
