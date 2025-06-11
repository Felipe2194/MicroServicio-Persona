import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonsModule } from './entities/persons/persons.module';
import { CityModule } from './entities/city/city.module';
import { ProvincesModule } from './entities/provinces/provinces.module'; // ¡Esta línea!

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // O el tipo de base de datos que uses (ej. 'postgres', 'mongodb')
      host: 'localhost', // O la IP/host de tu servidor de DB
      port: 3306, // O el puerto de tu servidor de DB
      username: 'root', // Tu usuario de base de datos
      password: '', // Tu contraseña de base de datos
      database: 'your_database_name', // <-- ¡MUY IMPORTANTE: CAMBIA ESTO!
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Busca automáticamente todas las entidades
      synchronize: true, // ¡SOLO PARA DESARROLLO! CUIDADO EN PRODUCCIÓN.
    }),
    PersonsModule,
    CityModule,
    ProvincesModule, // ¡Y esta línea en el array!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
