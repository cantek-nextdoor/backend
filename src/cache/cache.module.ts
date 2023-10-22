// cache.module.ts

import { CacheModule, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      max: 100, // Maximum number of items in the cache
      ttl: 60, // Cache TTL (time to live) in seconds
    }),
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheManagerModule {}