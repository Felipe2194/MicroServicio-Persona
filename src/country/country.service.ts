import { Injectable } from '@nestjs/common';

@Injectable()
export class CountryService {
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
    async create(createCountry: { id: number, name: string }) {
        return {
            id: createCountry.id,
            name: createCountry.name
        }
    }
    // PUT /countries/:id
    async update(id: number, updateCountry: { id: number, name: string }) {
        return {
            id: updateCountry.id,
            name: updateCountry.name
        }
    }
    // PATCH /countries/:id
  async partialUpdate(id: number, partialUpdate: { id: number; name: string }) {
        return {
            id: partialUpdate.id,
      name: partialUpdate.name,
        }
    }
    // DELETE /countries/:id
  async delete(id: number) {}
}