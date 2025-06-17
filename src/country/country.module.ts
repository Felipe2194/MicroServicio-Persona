import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
  imports: [TypeOrmModule.forFeature([CountryService])],
})
export class CountryModule { }
