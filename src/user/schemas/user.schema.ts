import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserAccount {
  DEFAULT = 'default',
  GOOGLE = 'google',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ unique: true })
  uuid: string;

  @Prop()
  displayName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    validate: {
      validator: (v) => {
        return /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(v);
      },
      message: (v) =>
        `Password must be at least 8 characters long, contain at least one letter and one number.`,
    },
  })
  password: string;

  @Prop({ default: UserAccount.DEFAULT })
  userType: UserAccount;

  @Prop()
  points: number;

  @Prop({
    required: true,
    validate: {
      validator: (v) => {
        return /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
          v,
        );
      },
      message: (v) => `Invalid postalCode ${v.value}`,
    },
  })
  postalCode: string;

  @Prop()
  likedPostList: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
