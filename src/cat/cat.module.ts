import { CatController } from './cat.controller';
import { LocationModule } from 'src/location/location.module';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => LocationModule)],
  controllers: [CatController],
})
export class CatModule {}
