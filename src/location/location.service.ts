import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Location, LocationDocument } from './schemas/location.schema';

import { Model } from 'mongoose';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location.name) private _locationModel: Model<LocationDocument>,
      ) {}
    
  async findLocation(postal_code: string): Promise<Location | undefined> {
    return this._locationModel.findOne({ postal_code: postal_code });
  }

  async getAllLocation() : Promise<Location[]> {
    return this._locationModel.find().exec();
  }
}
