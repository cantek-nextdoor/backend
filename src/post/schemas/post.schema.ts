import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  tag: [string];

  @Prop({ required: true})
  points: number;

  @Prop({ required: true })
  userId: string;

  @Prop({required: true })
  numOfLike: number;

  @Prop ({required: true })
  postedDate: Date;

  @Prop ()
  dueDate: Date;

  @Prop ({required: true })
  completed: boolean;

  @Prop()
  likedUserList: [String];

}

export const PostSchema = SchemaFactory.createForClass(Post);
