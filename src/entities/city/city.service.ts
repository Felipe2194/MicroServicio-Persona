import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../entities/city/city.entity';
import { Province } from '../../entities/province/province.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
    @InjectRepository(Province)
    private provinceRepo: Repository<Province>,
  ) {}

  async create(dto: CreateCityDto) {
    const province = await this.provinceRepo.findOne({
      where: { id: dto.provinceId },
      relations: ['country'],
    });
    if (!province) throw new NotFoundException('Province not found');

    const city = this.cityRepo.create({ name: dto.name, province });
    return this.cityRepo.save(city);
  }

  findAll() {
    return this.cityRepo.find({ relations: ['province', 'province.country'] });
  }

  async findOne(id: number) {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  async update(id: number, dto: UpdateCityDto) {
    const city = await this.cityRepo.findOne({ where: { id }, relations: ['province', 'province.country'] });
    if (!city) throw new NotFoundException('City not found');

    if (dto.name) city.name = dto.name;
    if (dto.provinceId) {
      const province = await this.provinceRepo.findOne({
        where: { id: dto.provinceId },
        relations: ['country'],
      });
      if (!province) throw new NotFoundException('Province not found');
      city.province = province;
    }

    return this.cityRepo.save(city);
  }

  async remove(id: number) {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) throw new NotFoundException('City not found');
    await this.cityRepo.remove(city);
    return { message: 'deleted' };
  }
}