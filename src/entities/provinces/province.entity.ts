import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../countries/country.entity'; // Asegurate que esta ruta sea correcta para tu entidad Country

@Entity('provinces') // Nombre de la tabla en la base de datos
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Para que el nombre de la provincia sea único
  name: string;

  @ManyToOne(() => Country) // Muchas provincias a un país
  @JoinColumn({ name: 'countryId' }) // La columna que relaciona con Country se llamará 'countryId'
  country: Country;

  @Column() // Necesitas almacenar el countryId directamente para la relación ManyToOne
  countryId: number;
}