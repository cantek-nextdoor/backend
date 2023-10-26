import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { status } from '../status/status';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true, unique: true })
  postId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  imageUrl: string;

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

  @Prop()
  eventDate: Date;

  @Prop({ required: true, default: status.open })
  status: status;

  @Prop()
  likedUserList: string[];

  @Prop()
  category: string
}

export const PostSchema = SchemaFactory.createForClass(Post);
