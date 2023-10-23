import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop()
  _id: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true, unique: true })
  postalCode: string;

  @Prop()
  place: string;
  
  @Prop()
  state: string;
  
  @Prop()
  stateCode: string;
  
  @Prop({ required: true })
  latitude: number;
  
  @Prop({ required: true })
  longtitude: number;

  @Prop()
  accuracyType: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
