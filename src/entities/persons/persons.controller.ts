import { Controller, Get } from '@nestjs/common';

@Controller('persons')
export class PersonsController {
    @Get()
    test() {
        return 'Hello from persons controller';
    }
}
