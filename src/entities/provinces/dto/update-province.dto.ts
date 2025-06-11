import { PartialType } from '@nestjs/mapped-types'; // Necesitas instalar '@nestjs/mapped-types'
import { CreateProvinceDto } from './create-province.dto';
import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional } from 'class-validator';

// Usamos PartialType para que todos los campos de CreateProvinceDto sean opcionales.
// Esto sirve tanto para PUT (donde se envían todos, pero al menos uno debe existir)
// como para PATCH (donde solo se envían los que cambian).
export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {
  // Opcional: puedes re-definir o añadir validaciones específicas si PatchProvinceDto tuviera reglas distintas.
  @IsString()
  @IsOptional()
  name?: string; // Asegúrate de que los campos sean opcionales con '?'

  @IsNumber()
  @IsInt()
  @IsOptional()
  countryId?: number;
}