import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import ScheduleTransactionUseCase from "./ScheduleTransaction.useCase";
import ScheduleTransactionNotFoundException from "../../domain/exceptions/ScheduleTransactionNotFound.exception";

export default class DeleteScheduleTransactionUseCase extends ScheduleTransactionUseCase implements UseCaseInterface {
    async execute(userId: number, id: number) {

        const scheduleTransaction = await this.scheduleRepository.findByIdAndUserId(id, userId)

        if (!scheduleTransaction) {
            throw new ScheduleTransactionNotFoundException(id)
        }

        await this.scheduleRepository.delete(scheduleTransaction)

    }
}