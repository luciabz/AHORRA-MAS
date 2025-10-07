import ScheduleTransactionUseCase from "./ScheduleTransaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CreateScheduleTransactionDto from "../dto/input/CreateScheduleTransaction.dto";
import ScheduleTransaction from "../../domain/entity/ScheduleTransaction";

export default class CreateScheduleTransactionUseCase extends ScheduleTransactionUseCase implements UseCaseInterface {
    async execute(userId: number, createScheduleTransactionDto: CreateScheduleTransactionDto) {
        const scheduleTransaction = new ScheduleTransaction()

        scheduleTransaction.userId = userId
        scheduleTransaction.categoryId = createScheduleTransactionDto.categoryId
        scheduleTransaction.type = createScheduleTransactionDto.type
        scheduleTransaction.regularity = createScheduleTransactionDto.regularity
        scheduleTransaction.description = createScheduleTransactionDto.description
        scheduleTransaction.amount = createScheduleTransactionDto.amount
        scheduleTransaction.periodicity = createScheduleTransactionDto.periodicity
        scheduleTransaction.nextOccurrence = createScheduleTransactionDto.nextOccurrence
        scheduleTransaction.endDate = createScheduleTransactionDto.endDate || null

        return this.scheduleRepository.save(scheduleTransaction)
    }
}