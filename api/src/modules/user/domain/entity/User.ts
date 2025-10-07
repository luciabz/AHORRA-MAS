import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("user")
export default class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 255, nullable: false})
    name: string

    @Column({type: "varchar", length: 255, unique: true, nullable: false})
    email: string

    @Column({type: "varchar", length: 255, nullable: false})
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}