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
  display_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: function () {
      this.user_type === UserAccount.DEFAULT;
    },
  })
  password: string;

  @Prop({ default: UserAccount.DEFAULT })
  user_type: UserAccount;

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
      message: (v) => `Invalid postal_code ${v.value}`,
    },
  })
  postal_code: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
