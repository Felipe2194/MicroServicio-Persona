import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PersonService } from './persons.service';

@Controller('PersonController')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Post('/person')
  async create(
    @Body()
    body: {
      name: string;
      email: string;
      birthDate: string;
      cityId: number;
    },
  ) {
    const { name, email, birthDate, cityId } = body;
    // Validaciones básicas
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof birthDate !== 'string' ||
      typeof cityId !== 'number'
    ) {
      throw new BadRequestException('Datos inválidos');
    }

    return this.personService.create({ name, email, birthDate, cityId });
  }
}
