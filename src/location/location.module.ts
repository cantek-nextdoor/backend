import { CacheManagerModule } from '../cache/cache.module';
import { Location, LocationSchema } from './schemas/location.schema';
import { LocationService } from './location.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    CacheManagerModule,
  ],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
