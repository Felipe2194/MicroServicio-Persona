import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonsModule } from './entities/persons/persons.module';
import { CityModule } from './entities/city/city.module';
import { ProvinceModule } from './entities/province/province.module'; // ¡CORREGIDO A SINGULAR y ruta singular!
import { AuthModule } from './auth/auth.module'; // ¡Importa tu AuthModule aquí!
// import { UsersModule } from './users/users.module'; // Si aún no lo usas o no existe, déjalo comentado.

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // O el tipo de base de datos que uses (ej. 'postgres', 'mongodb')
      host: 'localhost', // O la IP/host de tu servidor de DB
      port: 3306, // O el puerto de tu servidor de DB
      username: 'root', // Tu usuario de base de datos
      password: '', // Tu contraseña de base de datos
      database: 'your_database_name', // <-- ¡MUY IMPORTANTE: CAMBIA ESTO AL NOMBRE REAL DE TU DB!
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Busca automáticamente todas las entidades
      synchronize: true, // ¡SOLO PARA DESARROLLO! CUIDADO EN PRODUCCIÓN.
    }),
    PersonsModule,
    CityModule,
    ProvinceModule, // <<-- ¡CORREGIDO EL NOMBRE AQUÍ DENTRO DEL ARRAY DE IMPORTS!
    AuthModule,     // <<-- Módulo de autenticación (ahora fusionado correctamente)
    // UsersModule, // Si lo necesitas y existe, descomenta aquí.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}