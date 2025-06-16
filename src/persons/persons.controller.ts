import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { PersonService } from './persons.service';
// Importa el DTO de paginación (ajusta la ruta si es necesario)
import { PaginationDto } from './pagination.dto';
import { Persons } from '../entities/persons.entity';
import { UpdatePersonDto } from './update.dto';
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
    // Validaciones básicas de email
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
  @Get() // 3
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: Persons[]; total: number }> {
    console.log(`Petición GET /persons - DTO recibido:`, paginationDto);
    return this.personService.findAll(
      paginationDto.page,
      paginationDto.quantity,
    );
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Persons> {
    console.log(`Petición GET /persons/${id}`);
    const person = await this.personService.findOne(id); // El servicio devuelve Persons | null

    if (!person) {
      // Si 'person' es null (no se encontró ninguna persona)
      throw new NotFoundException(`Persona con ID "${id}" no encontrada.`); // Lanza una excepción 404
    }

    return person; // Si se encuentra, la devuelve
  }
  @Put(':id')
  async updatePerson(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdatePersonDto,
  ): Promise<any> {
    const updated = await this.personService.update(id, changes);

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      birthDate: updated.birthDate,
      city: {
        id: updated.city.id,
        name: updated.city.name,
        province: {
          id: updated.city.province.id,
          name: updated.city.province.name,
          country: {
            id: updated.city.province.pais.id,
            name: updated.city.province.pais.name,
          },
        },
      },
    };
  }
  @Patch(':id')
  async updatePartial(
    @Param('id') id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Persons> {
    const updatedPerson = await this.personService.updatePartial(
      id,
      updatePersonDto,
    );
    return updatedPerson;
  }
  @Delete(':id') // La ruta será /person/:id
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // Define el tipo de retorno esperado
    // El servicio lanzará NotFoundException si no encuentra la persona,
    // NestJS lo capturará y devolverá un 404 automáticamente.
    return this.personService.remove(id);
  }
}
