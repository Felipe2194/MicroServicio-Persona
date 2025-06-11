import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity('province')
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Country, (country) => country.provincias)
  @JoinColumn({ name: 'countryId' })
  pais: Country;
  @OneToMany(() => City, (city) => city.provincia)
  ciudades: City[];
}
