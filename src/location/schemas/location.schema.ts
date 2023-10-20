import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop()
  id: string;

  @Prop({ required: true })
  country_code: string;

  @Prop({ required: true, unique: true })
  postal_code: string;

  @Prop()
  place: string;
  
  @Prop()
  state: string;
  
  @Prop()
  state_code: string;
  
  @Prop({ required: true })
  latitude: number;
  
  @Prop({ required: true })
  longtitude: number;

  @Prop()
  accuracy_type: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
