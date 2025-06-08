import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities'; // Importa todas las entidades desde el archivo entities.ts


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            database: 'users',
            username: 'userexample',
            password: 'paswordexample',
            synchronize: true,
            entities,
            port: 5433,
            host: 'localhost',
        }),
        TypeOrmModule.forFeature(entities) // entidades por cada modulo
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

