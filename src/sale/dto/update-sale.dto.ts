import { status } from '../status/status';

export class UpdateSaleDto {
  saleId: string;
  title: string;
  imageUrl: string[];
  description: string;
  tags: string;
  points: number;
  postedDate: Date;
  status: status;
  likedUserList: string[];
}
