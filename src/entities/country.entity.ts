import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Province } from './province.entity';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Province, (province) => province.pais)
  provincias: Province[];
}
