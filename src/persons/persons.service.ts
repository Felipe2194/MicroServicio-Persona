import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Persons } from '../entities/persons.entity';
import { City } from '../entities/city.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { UpdatePersonDto } from './update.dto'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Persons) private personRepo: Repository<Persons>,
    @InjectRepository(City) private cityRepo: Repository<City>,
  ) {}
  //metodo que realiza el post de una nueva persona
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
    } //crea la nueva persona en la base de datos
    const newPerson = this.personRepo.create({
      name: data.name,
      email: data.email,
      birthDate: data.birthDate,
      city,
    });

    return await this.personRepo.save(newPerson);
  }
  //metodo que realiza el GET
  // de todas las personas con paginación
  async findAll(
    page: number,
    quantity: number = 10,
  ): Promise<{ data: Persons[]; total: number }> {
    const options: FindManyOptions<Persons> = {
      relations: {
        city: {
          provincia: {
            // <-- NOTA: Asumiendo que la propiedad en City.entity.ts es 'province'
            pais: true, // <-- NOTA: Asumiendo que la propiedad en Provincia.entity.ts es 'country'
          },
        },
      },
      skip: (page - 1) * quantity,
      take: quantity,
    };

    const [data, total] = await this.personRepo.findAndCount(options);
    return { data, total };
  }
  //metodo que realiza el GET por id
  async findOne(id: number): Promise<Persons | null> {
    // Puede devolver undefined si no se encuentra
    return await this.personRepo.findOne({
      where: { id: id },
      relations: {
        // Carga las relaciones anidadas aquí
        city: {
          provincia: {
            // Propiedad 'provincia' en la entidad City
            ciudades: true, // Propiedad 'country' en la entidad Provincia
          },
        },
      },
    });
  }
  //metodo que realiza el PUT
  async update(id: number, changes: UpdatePersonDto): Promise<Persons> {
    const person = await this.personRepo.findOne({
      where: { id: id },
      relations: { city: { provincia: { pais: true } } },
    });

    if (!person) {
      throw new NotFoundException(`Persona con ID "${id}" no encontrada.`);
    }

    let city: City | null;
    if (changes.cityId) {
      city = await this.cityRepo.findOne({
        where: { id: changes.cityId },
        relations: { provincia: { pais: true } },
      });
      if (!city) {
        throw new NotFoundException(
          `Ciudad con ID "${changes.cityId}" no encontrada.`,
        );
      }
      person.city = city;
    }

    if (changes.name !== undefined) person.name = changes.name;
    if (changes.email !== undefined) person.email = changes.email;
    if (changes.birthDate !== undefined) person.birthDate = changes.birthDate;

    const updatedPerson = await this.personRepo.save(person);

    return (await this.personRepo.findOne({
      where: { id: updatedPerson.id },
      relations: { city: { provincia: { pais: true } } },
    })) as Persons;
  }
  //metodo que realiza el PATCH
  async updatePartial(
    id: number,
    updateData: UpdatePersonDto,
  ): Promise<Persons> {
    const person = await this.personRepo.findOne({
      where: { id },
      relations: ['city', 'city.province', 'city.province.country'],
    });

    if (!person) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }

    if (updateData.cityId) {
      const city = await this.cityRepo.findOne({
        where: { id: updateData.cityId },
        relations: ['province', 'province.country'],
      });

      if (!city) {
        throw new NotFoundException(
          `City with id ${updateData.cityId} not found`,
        );
      }
      person.city = city;
    }

    if (updateData.name !== undefined) person.name = updateData.name;
    if (updateData.email !== undefined) person.email = updateData.email;
    if (updateData.birthDate !== undefined)
      person.birthDate = updateData.birthDate;

    await this.personRepo.save(person);
    const updatedPerson = await this.personRepo.findOne({
      where: { id },
      relations: ['city', 'city.province', 'city.province.country'],
    });

    if (!updatedPerson) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }

    return updatedPerson;
  }
  //metodo para eleminar una porsona por id
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.personRepo.delete(id);

    // Si no se encontró y eliminó ninguna fila, significa que la persona no existía.
    if (result.affected === 0) {
      throw new NotFoundException(`Person with ID ${id} not found.`);
    }

    return { message: `Person with ID ${id} has been deleted.` };
  }
}
