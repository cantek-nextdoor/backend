import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  display_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  points: number;

  @Prop({ required: true })
  postal_code: string;

  @Prop () 
  likedPostList: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
