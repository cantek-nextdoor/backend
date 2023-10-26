import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { status } from '../status/status';
import { category } from '../status/status copy';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true, unique: true })
  postId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  imageUrl: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  tags: string[];

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

  @Prop({type:[String] , default: []})
  likedUserList: string[];

  @Prop()
  latitude: number;

  @Prop()
  longtitude: number;

  @Prop({ required: true })
  categories: category;

  @Prop()
  eventDateAndTime: Date;

  @Prop()
  postalCode: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
