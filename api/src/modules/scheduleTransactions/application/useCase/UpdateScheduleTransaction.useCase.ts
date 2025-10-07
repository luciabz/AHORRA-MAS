import ScheduleTransactionUseCase from "./ScheduleTransaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import ScheduleTransaction from "../../domain/entity/ScheduleTransaction";
import ScheduleTransactionNotFoundException from "../../domain/exceptions/ScheduleTransactionNotFound.exception";

export default class UpdateScheduleTransactionUseCase extends ScheduleTransactionUseCase implements UseCaseInterface {
    async execute(userId: number, id: number, createScheduleTransactionDto: Partial<ScheduleTransaction>) {
        const scheduleTransaction = await this.scheduleRepository.findByIdAndUserId(id, userId)

        if (!scheduleTransaction) throw new ScheduleTransactionNotFoundException(id)

        if (createScheduleTransactionDto.categoryId !== undefined)
            scheduleTransaction.categoryId = createScheduleTransactionDto.categoryId
        if (createScheduleTransactionDto.type !== undefined)
            scheduleTransaction.type = createScheduleTransactionDto.type
        if (createScheduleTransactionDto.regularity !== undefined)
            scheduleTransaction.regularity = createScheduleTransactionDto.regularity
        if (createScheduleTransactionDto.description !== undefined)
            scheduleTransaction.description = createScheduleTransactionDto.description
        if (createScheduleTransactionDto.amount !== undefined)
            scheduleTransaction.amount = createScheduleTransactionDto.amount
        if (createScheduleTransactionDto.periodicity !== undefined)
            scheduleTransaction.periodicity = createScheduleTransactionDto.periodicity
        if (createScheduleTransactionDto.nextOccurrence !== undefined)
            scheduleTransaction.nextOccurrence = createScheduleTransactionDto.nextOccurrence
        if (createScheduleTransactionDto.endDate !== undefined)
            scheduleTransaction.endDate = createScheduleTransactionDto.endDate || null

        return this.scheduleRepository.save(scheduleTransaction)
    }
}