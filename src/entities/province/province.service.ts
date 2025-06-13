import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './province.entity';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Country } from '../countries/country.entity'; // Asegúrate que esta ruta sea correcta para tu entidad Country

@Injectable()
export class ProvinceService { // <<-- ¡CORREGIDO: Clase del servicio en singular!
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>, // <<-- ¡CORREGIDO: Nombre de variable en singular!
    @InjectRepository(Country) // Inyectamos el repositorio de Country para validar countryId
    private countryRepository: Repository<Country>,    // <<-- ¡CORREGIDO: Nombre de variable en singular!
  ) {}

  // POST /province
  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const country = await this.countryRepository.findOne({ where: { id: createProvinceDto.countryId } }); // <<-- CORREGIDO
    if (!country) {
      throw new NotFoundException(`El país con ID ${createProvinceDto.countryId} no fue encontrado.`);
    }

    // Opcional: Podrías verificar si ya existe una provincia con el mismo nombre y countryId
    const existingProvince = await this.provinceRepository.findOne({ // <<-- CORREGIDO
        where: { name: createProvinceDto.name, country: { id: createProvinceDto.countryId } }
    });
    if (existingProvince) {
        throw new BadRequestException(`La provincia '${createProvinceDto.name}' ya existe para el país con ID ${createProvinceDto.countryId}.`);
    }

    const newProvince = this.provinceRepository.create({ ...createProvinceDto, country }); // <<-- CORREGIDO
    return this.provinceRepository.save(newProvince); // <<-- CORREGIDO
  }

  // GET /province
  async findAll(): Promise<Province[]> {
    return this.provinceRepository.find({ relations: ['country'] }); // <<-- CORREGIDO
  }

  // GET /province/:id
  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({ where: { id }, relations: ['country'] }); // <<-- CORREGIDO
    if (!province) {
      throw new NotFoundException(`La provincia con ID ${id} no fue encontrada.`);
    }
    return province;
  }

  // PUT /province/:id (Actualización completa)
  async update(id: number, updateProvinceDto: UpdateProvinceDto): Promise<Province> {
    const province = await this.findOne(id); // Verificamos que la provincia exista

    // Si se envía un nuevo countryId, validamos que el país exista
    if (updateProvinceDto.countryId && updateProvinceDto.countryId !== province.countryId) {
        const newCountry = await this.countryRepository.findOne({ where: { id: updateProvinceDto.countryId } }); // <<-- CORREGIDO
        if (!newCountry) {
            throw new NotFoundException(`El país con ID ${updateProvinceDto.countryId} no fue encontrado.`);
        }
        province.country = newCountry;
        province.countryId = newCountry.id; // Actualizamos el countryId en la entidad
    }

    // Actualizamos el nombre si se provee
    if (updateProvinceDto.name !== undefined) {
      province.name = updateProvinceDto.name;
    }

    return this.provinceRepository.save(province); // <<-- CORREGIDO
  }

  // PATCH /province/:id (Actualización parcial)
  // Reutilizamos el mismo DTO y método PUT, ya que 'PartialType' lo hace flexible.
  // La diferencia real está en cómo se maneja la lógica de negocio y validación.
  // En este caso, el comportamiento es muy similar al PUT parcial,
  // ya que solo se actualizarán los campos que se envíen en updateProvinceDto.
  async patch(id: number, updateProvinceDto: UpdateProvinceDto): Promise<Province> {
    const province = await this.findOne(id); // Verificamos que la provincia exista

    // Si se envía un nuevo countryId, validamos que el país exista
    if (updateProvinceDto.countryId && updateProvinceDto.countryId !== province.countryId) {
        const newCountry = await this.countryRepository.findOne({ where: { id: updateProvinceDto.countryId } }); // <<-- CORREGIDO
        if (!newCountry) {
            throw new NotFoundException(`El país con ID ${updateProvinceDto.countryId} no fue encontrado.`);
        }
        province.country = newCountry;
        province.countryId = newCountry.id; // Actualizamos el countryId en la entidad
    }

    // Actualizamos el nombre si se provee
    if (updateProvinceDto.name !== undefined) {
      province.name = updateProvinceDto.name;
    }

    return this.provinceRepository.save(province); // <<-- CORREGIDO
  }

  // DELETE /province/:id (Aunque no lo pediste, es bueno tenerlo para un CRUD completo)
  async remove(id: number): Promise<void> {
    const result = await this.provinceRepository.delete(id); // <<-- CORREGIDO
    if (result.affected === 0) {
      throw new NotFoundException(`La provincia con ID ${id} no fue encontrada para eliminar.`);
    }
  }
}