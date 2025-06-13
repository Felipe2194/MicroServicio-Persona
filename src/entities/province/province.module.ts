import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceService } from './province.service';     // <<-- ¡CORREGIDO a singular!
import { ProvinceController } from './province.controller'; // <<-- ¡CORREGIDO a singular!
import { Province } from './province.entity';
import { Country } from '../countries/country.entity'; // Esta ruta ya la hemos validado, es correcta

@Module({
  imports: [
    TypeOrmModule.forFeature([Province, Country]) // Registrar Province y Country con TypeORM
  ],
  controllers: [ProvinceController], // <<-- ¡CORREGIDO a singular!
  providers: [ProvinceService],    // <<-- ¡CORREGIDO a singular!
  exports: [ProvinceService],      // <<-- ¡CORREGIDO a singular!
})
export class ProvinceModule {} // <<-- ¡CORREGIDO a singular!