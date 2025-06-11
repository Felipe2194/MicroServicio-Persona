import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('persons')
export class Person extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @Column()
    cityId: number;
}
