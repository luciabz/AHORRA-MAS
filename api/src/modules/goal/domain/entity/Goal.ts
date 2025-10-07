import {GoalStateEnum} from "../enums/GoalState.enum";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("goal")
export default class Goal {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "int", nullable: false})
    userId: number
    @Column({type: "varchar", length: 255, nullable: false})
    title: string
    @Column({type: "text", nullable: false})
    description: string
    @Column({type: "decimal", precision: 10, scale: 2, nullable: false})
    targetAmount: number
    @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: false})
    currentAmount: number
    @Column({type: "timestamp", nullable: false})
    deadline: Date
    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date
    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt: Date

    @Column({type: "enum", enum: GoalStateEnum, default: GoalStateEnum.ACTIVE, nullable: false})
    state: GoalStateEnum

}