import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persons } from '../entities/persons.entity';
import { City } from '../entities/city.entity';
import { PersonService } from './persons.service';
import { PersonController } from './persons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Persons, City])],
  providers: [PersonService],
  controllers: [PersonController],
})
export class PersonModule {}
