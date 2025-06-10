import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { createPerson } from './createPerson';
import e from 'express';


@Controller('persons')
export class PersonsController {
    @Get()
    test() {
        return 'FUNCIONAAAA'; //http://localhost:3000/persons para probar que funcione
    }
    @Post()
    create(@Body() createPerson: createPerson) {
        return {
            name: createPerson.name,
            email: createPerson.email,
            birthDate: createPerson.birthDate,
            cityId: createPerson.cityId,
        }
    }
    @Put()
    test3() {
        return 'ACTUALIZANDO PERSONAS'
    }
    @Delete()
    test4() {
        return 'ELIMINANDO PERSONAS'
    }
}