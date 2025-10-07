import TransactionUseCase from "./Transaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import Transaction from "../../domain/entity/Transaction";
import TransactionNotFoundException from "../../domain/exceptions/TransactionNotFound.exception";

export default class UpdateTransactionUseCase extends TransactionUseCase implements UseCaseInterface {
    async execute(userId: number, id: number, createScheduleTransactionDto: Partial<Transaction>) {
        const transaction = await this.transactionRepository.findByIdAndUserId(id, userId)

        if (!transaction) throw new TransactionNotFoundException(id)

        if (createScheduleTransactionDto.categoryId !== undefined)
            transaction.categoryId = createScheduleTransactionDto.categoryId
        if (createScheduleTransactionDto.type !== undefined)
            transaction.type = createScheduleTransactionDto.type
        if (createScheduleTransactionDto.regularity !== undefined)
            transaction.regularity = createScheduleTransactionDto.regularity
        if (createScheduleTransactionDto.description !== undefined)
            transaction.description = createScheduleTransactionDto.description
        if (createScheduleTransactionDto.amount !== undefined)
            transaction.amount = createScheduleTransactionDto.amount

        return this.transactionRepository.save(transaction)
    }
}