import { CacheService } from '../cache/cache.service';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Location, LocationDocument } from './schemas/location.schema'; // Import the CacheService
import { Model } from 'mongoose';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private _locationModel: Model<LocationDocument>,
    private _cacheService: CacheService
  ) {}

  async FindLocation(postal_code: string): Promise<Location | undefined> {
    return this._locationModel.findOne({ PostalCode: postal_code });
  }

  async GetAllLocation(): Promise<Location[]> {
    return this._locationModel.find().exec();
  }

  async GetNearbyPostalCodes(
    distance: number, // in kilometers
    postalCode: string,
  ): Promise<Location[]> {
    const cacheKey = `nearbyPostalCodes:${postalCode}:${distance}`;

    const cachedResult = await this._cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const targetLocation = await this._locationModel.findOne({ postalCode : postalCode }).exec();

    if (!targetLocation) {
      return []; // if location not found, return blank;
    }

    const nearbyAreaCodes = await this._locationModel.find({ postalCode : { $ne: postalCode }}).exec();

    const result = [];
    nearbyAreaCodes.forEach(item => {
      if (this.CalculateDistance(targetLocation.latitude, targetLocation.longtitude, 
                                 item.latitude, item.longtitude) <= distance)
      {
        result.push(item);
      }
    });

    // Cache the result with a specific time-to-live (TTL)
    await this._cacheService.set(cacheKey, result, 3600); // Cache result for 1 hour
    return result;
  }

  CalculateDistance(lat1:number, long1:number, lat2:number, long2:number) : number
  {
    const radius = 6371.0; // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    lat1 = this.ConvertDegreesToRadians(lat1);
    long1 = this.ConvertDegreesToRadians(long1);
    lat2 = this.ConvertDegreesToRadians(lat2);
    long2 = this.ConvertDegreesToRadians(long2);

    // Haversine formula
    const dlon = long2 - long1;
    const dlat = lat2 - lat1;

    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = radius * c;

    return distance;
  }

  private ConvertDegreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

