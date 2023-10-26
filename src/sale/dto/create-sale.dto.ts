import { status } from '../status/status';

export class CreateSaleDto {
  saleId: string;
  title: string;
  imageUrl: string[];
  description: string;
  tags: string;
  points: number;
  userId: string;
  numOfLike: number;
  postedDate: Date;
  status: status;
  likedUserList: string[];
}
