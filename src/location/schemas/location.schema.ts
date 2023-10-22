import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop()
  _id: string;

  @Prop({ required: true })
  CountryCode: string;

  @Prop({ required: true, unique: true })
  PostalCode: string;

  @Prop()
  Place: string;
  
  @Prop()
  State: string;
  
  @Prop()
  StateCode: string;
  
  @Prop({ required: true })
  Latitude: number;
  
  @Prop({ required: true })
  Longtitude: number;

  @Prop()
  AccuracyType: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
