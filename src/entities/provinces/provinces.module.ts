import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvincesService } from './provinces.service';
import { ProvincesController } from './provinces.controller';
import { Province } from './province.entity';
import { Country } from '../countries/country.entity'; // Necesario si ProvincesService inyecta CountryRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([Province, Country]) // Registrar Province y Country con TypeORM
  ],
  controllers: [ProvincesController],
  providers: [ProvincesService],
  exports: [ProvincesService], // Si otros módulos necesitarán usar ProvincesService
})
export class ProvincesModule {}