import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Province } from '../entities/province.entity';
import { CreateCityDto } from './CreateCityDto.dto';
import { UpdateCityDto } from './update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
    @InjectRepository(Province)
    private provinceRepo: Repository<Province>,
  ) {}

  async create(dto: CreateCityDto): Promise<City> {
    const province = await this.provinceRepo.findOne({
      where: { id: dto.provinceId },
      // relations: ['country'], // Opcional, solo si quieres cargar el país de la provincia aquí
    });

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    // CORRECCIÓN: Asigna el name y el provinceId. TypeORM manejará la relación
    // alternativamente, puedes asignar directamente el objeto province
    const city = this.cityRepo.create({
      name: dto.name,
      provinceId: dto.provinceId, // Asignar el ID de la clave foránea
      province: province, // Asignar la entidad Province completa para la relación
    });

    return this.cityRepo.save(city);
  }

  findAll(): Promise<City[]> {
    return this.cityRepo.find({ relations: ['province', 'province.country'] });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async update(id: number, dto: UpdateCityDto): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { id },
      // No necesitas cargar 'relations' aquí para el findOne si solo vas a actualizar campos escalares o IDs de relación.
      // Solo si necesitas acceder a propiedades de la relación para la lógica de actualización.
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }

    if (dto.name !== undefined) {
      city.name = dto.name;
    }

    if (dto.provinceId !== undefined) {
      const province = await this.provinceRepo.findOne({
        where: { id: dto.provinceId },
        // relations: ['country'], // Opcional
      });
      if (!province) {
        throw new NotFoundException('Province not found');
      }
      // CORRECCIÓN: Asegúrate de que el nombre de la propiedad sea 'province'
      city.province = province;
      city.provinceId = dto.provinceId; // Asegúrate de actualizar también el ID
    }

    // Guarda la entidad con los cambios
    await this.cityRepo.save(city);

    // Vuelve a buscar la entidad con las relaciones cargadas para la respuesta
    const updatedCity = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });

    if (!updatedCity) {
      throw new NotFoundException('City not found after update'); // Esto no debería ocurrir
    }

    return updatedCity;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.cityRepo.delete(id); // Uso de delete por ID para eficiencia

    if (result.affected === 0) {
      throw new NotFoundException('City not found');
    }
    return { message: 'City has been deleted' };
  }
}
