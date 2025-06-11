import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { Persons } from './persons.entity';

@Entity('ciudad')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Province, (provincia) => provincia.ciudades)
  @JoinColumn({ name: 'provinceId' })
  provincia: Province;

  @OneToMany(() => Persons, (person) => person.city)
  persons: Persons[];
}
