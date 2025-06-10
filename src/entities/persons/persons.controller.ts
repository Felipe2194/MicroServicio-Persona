import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { createPerson } from './createPerson';


@Controller('persons')
export class PersonsController {
    @Get()
    test() {
        return 'FUNCIONAAAA'; //http://localhost:3000/persons para probar que funcione
    }
    @Post()
    create(@Body() createPerson: createPerson) {
        return {
            message: 'PERSONA CREADA CON EXITO',
            data: createPerson
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