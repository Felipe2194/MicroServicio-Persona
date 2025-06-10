import { Body, Controller, Get, Patch, Post, Put, Delete } from '@nestjs/common';
import { CreateCountry } from './createCountry';

@Controller('country')
export class CountryController {
    @Get()
    get() {
        return {
            id: Number, name: String,
        }
    }
    @Get('/country/:id')
    getid() {
        return {
            id: Number, name: String,
        }
    }
    @Post()
    post(@Body() CreateCountry: CreateCountry) {
        return {
            id: CreateCountry.id, name: CreateCountry.name,
        }
    }
    @Put('/country/:id')
    put(@Body() CreateCountry: CreateCountry) {
        return {
            id: CreateCountry.id, name: CreateCountry.name,
        }
    }
    @Patch('/country/:id')
    patch(@Body() CreateCountry: CreateCountry) {
        return {
            id: CreateCountry.id, name: CreateCountry.name,
        }
    }
    @Delete('/country/:id')
    delete() {
        return { message: "deleted" }
    }


}



