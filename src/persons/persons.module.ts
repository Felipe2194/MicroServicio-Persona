import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persons } from '../entities/persons.entity';
import { City } from '../entities/city.entity';
import { PersonService } from './persons.service';
import { PersonController } from './persons.controller';
import { Country } from 'src/entities/country.entity';
import { Province } from 'src/entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persons, City, Province, Country])],
  providers: [PersonService],
  controllers: [PersonController],
  exports: [PersonService], // Exportamos el servicio para que pueda ser utilizado en otros módulos
  // si es necesario
})
export class PersonModule {}
