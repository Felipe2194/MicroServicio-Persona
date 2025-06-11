import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province } from './province.entity';

@Controller('province') // Prefijo de la ruta: todas las rutas aquí empiezan con /province
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  // POST /province
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna código 201 Created
  create(@Body() createProvinceDto: CreateProvinceDto): Promise<Province> {
    return this.provincesService.create(createProvinceDto);
  }

  // GET /province
  @Get()
  findAll(): Promise<Province[]> {
    return this.provincesService.findAll();
  }

  // GET /province/:id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Province> {
    return this.provincesService.findOne(+id); // El '+' convierte el string 'id' a número
  }

  // PUT /province/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto): Promise<Province> {
    return this.provincesService.update(+id, updateProvinceDto);
  }

  // PATCH /province/:id
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto): Promise<Province> {
    return this.provincesService.patch(+id, updateProvinceDto);
  }

  // DELETE /province/:id (Opcional, pero se recomienda implementarlo para un CRUD completo)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna código 204 No Content para eliminación exitosa
  remove(@Param('id') id: string): Promise<void> {
    return this.provincesService.remove(+id);
  }
}