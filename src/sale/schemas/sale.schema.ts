import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { status } from '../status/status';

export type SaleDocument = HydratedDocument<Sale>;

@Schema()
export class Sale {
  @Prop({ required: true, unique: true })
  saleId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  imageUrl: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  tags: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  numOfLike: number;

  @Prop({ required: true })
  postedDate: Date;

  @Prop({ required: true, default: status.open })
  status: status;

  @Prop()
  likedUserList: string[];
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
