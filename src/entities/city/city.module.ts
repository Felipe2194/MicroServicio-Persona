import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../../entities/city/city.entity';
import { Province } from '../../entities/province/province.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City, Province])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}