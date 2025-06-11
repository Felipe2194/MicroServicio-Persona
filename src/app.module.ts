import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonsModule } from './persons/persons.module';
import { CityController } from './city/city.controller';
import { CityModule } from './city/city.module';
import { ProvinceController } from './province/province.controller';
import { ProvinceModule } from './province/province.module';
import { CountryController } from './country/country.controller';
import { CountryModule } from './country/country.module';

@Module({
  imports: [PersonsModule, CityModule, ProvinceModule, CountryModule],
  controllers: [AppController, CityController, ProvinceController, CountryController],
  providers: [AppService],
})
export class AppModule { }
