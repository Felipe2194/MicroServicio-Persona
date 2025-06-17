// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Importa todos tus módulos aquí (PersonModule, CityModule, ProvinceModule, CountryModule)
import { PersonModule } from './persons/persons.module';
import { CityModule } from './city/city.module';
import { ProvinceModule } from './province/province.module';
import { CountryModule } from './country/country.module';
// Importa todas tus entidades aquí
import { Persons } from './entities/persons.entity';
import { City } from './entities/city.entity';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';
import { Users } from './entities/users.entity';
import { permission } from './entities/permissions.entity';
import { roles } from './entities/roles.entity';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // El tipo de base de datos
      host: 'localhost', // O '127.0.0.1' si 'localhost' da problemas. Es el puerto de tu máquina.
      port: 5432, // El puerto mapeado de Docker
      username: 'CarolinaRubio', // <--- MISMO USUARIO QUE EN docker-compose.yml
      password: '12345', // <--- MISMA CONTRASEÑA QUE EN docker-compose.yml
      database: 'persona', // <--- MISMA DB QUE EN docker-compose.yml
      entities: [Persons, City, Province, Country], // Lista todas tus entidades
      synchronize: true, // ¡Cuidado! Solo para desarrollo. Crea/actualiza tablas automáticamente.
      logging: true, // Opcional: Muestra los logs de TypeORM en la consola
    }),
    PersonModule,
    CityModule,
    ProvinceModule,
    CountryModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    // ... otros módulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
