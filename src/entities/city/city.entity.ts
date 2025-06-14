import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Province } from '../province/province.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Province, province => province.cities, { eager: true })
  @JoinColumn({ name: 'provinceId' })
  province: Province;
}