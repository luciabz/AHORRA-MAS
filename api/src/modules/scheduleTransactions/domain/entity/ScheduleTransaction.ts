import {TransactionRegularityEnum} from "../../../../share/enums/TransactionRegularity.enum";
import {TransactionTypeEnum} from "../../../../share/enums/TransactionType.enum";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("schedule_transaction")
export default class ScheduleTransaction {
    @PrimaryGeneratedColumn()
    id: number
    @Column({type: "int", nullable: false})
    userId: number
    @Column({type: "int", nullable: false})
    categoryId: number

    @Column({type: "enum", enum: TransactionTypeEnum, nullable: false})
    type: TransactionTypeEnum

    @Column({type: "enum", enum: TransactionRegularityEnum, nullable: false})
    regularity: TransactionRegularityEnum

    @Column({type: "boolean", default: true, nullable: false})
    status: boolean

    @Column({type: "varchar", length: 255, nullable: false})
    description: string

    @Column({type: "decimal", precision: 10, scale: 2, nullable: false})
    amount: number

    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date

    @Column({type: "varchar", length: 50, nullable: false})
    periodicity: `${number} ${'day' | 'week' | 'month' | 'year'}`
    @Column({type: "timestamp", nullable: false})
    nextOccurrence: Date
    @Column({type: "timestamp", nullable: true})
    endDate: Date | null

}