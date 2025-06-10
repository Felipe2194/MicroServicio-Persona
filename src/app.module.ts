import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonsModule } from './entities/persons/persons.module';
import { CityModule } from './entities/city/city.module';

@Module({
  imports: [PersonsModule, CityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
