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
  name: string;
  //hace la relacion de cada ciudad con su provincia
  @ManyToOne(() => Country, (country) => country.provinces)
  @JoinColumn({ name: 'countryId' })
  country: Country;
  //hace la relacion de cada provincia con sus ciudades
  @Column()
  countryId: number;
  @OneToMany(() => City, (city) => city.province)
  citis: City[];
}
