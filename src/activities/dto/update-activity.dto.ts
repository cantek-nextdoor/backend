import { status } from '../status/status';

export class UpdateActivityDto {
  saleId: string;
  title: string;
  imageUrl: string[];
  description: string;
  tags: string;
  points: number;
  postedDate: Date;
  eventDateAndTime: Date;
  status: status;
  location: string;
  likedUserList: string[];
}
