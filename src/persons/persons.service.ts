import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Persons } from '../entities/persons.entity';
import { City } from '../entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Persons) private personRepo: Repository<Persons>,
    @InjectRepository(City) private cityRepo: Repository<City>,
  ) {}

  async create(data: {
    name: string;
    email: string;
    birthDate: string;
    cityId: number;
  }): Promise<Persons> {
    const city = await this.cityRepo.findOne({
      where: { id: data.cityId },
      relations: ['province', 'province.pais'],
    });

    if (!city) {
      throw new NotFoundException('Ciudad no encontrada');
    }

    const newPerson = this.personRepo.create({
      name: data.name,
      email: data.email,
      birthDate: data.birthDate,
      city,
    });

    return await this.personRepo.save(newPerson);
  }
}
