import { Injectable } from '@nestjs/common';
import { UpdateCountry } from './updateCountry';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';


@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
    ) { }

    // GET /countries
    async getAll() {
        return await this.getAll();
    }
    // GET /countries/:id
    async findOne(id: number) {
        return {
            id, name: String
        };
    }
    // POST /countries
    async create(createCountry: { name: string }) {
        return {
            name: createCountry.name
        }
    }
    // PUT /countries/:id
    async update(id: number, updateCountry: { name: string }) {
        return {
            id: id,
            name: updateCountry.name
        }
    }
    // PATCH /countries/:id
    async partialUpdate(id: number, UpdateCountry: { name?: string }) {
        return {
            id: id,
            name: UpdateCountry.name
        }
    }
    // DELETE /countries/:id
    async delete(id: number) {
        await this.countryRepository.delete(id);
        return { message: `Country id: ${id} deleted` };
    }

}
