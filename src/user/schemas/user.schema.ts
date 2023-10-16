import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  display_name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  points: number;

  @Prop()
  postal_code: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
