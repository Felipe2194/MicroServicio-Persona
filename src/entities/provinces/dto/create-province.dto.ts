import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber() // countryId debe ser un número
  @IsInt() // Aseguramos que sea un entero
  @IsNotEmpty()
  countryId: number;
}