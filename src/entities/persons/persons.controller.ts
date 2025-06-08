import { Controller, Get } from '@nestjs/common';

@Controller('persons')
export class PersonsController {
    @Get()
    test() {
        return 'Hello from persons controller'; //http://localhost:3000/persons para probar que funcione
    }
}
