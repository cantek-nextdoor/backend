import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  postPoints: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  fromPoints: number;

  @Prop({ required: true })
  toPoints: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
