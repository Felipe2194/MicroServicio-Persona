import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('persons')
export class Person extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: String;

    @Column()
    email: String;

    @Column()
    birthdate: Date;

    @Column()
    cityId: number;
}
