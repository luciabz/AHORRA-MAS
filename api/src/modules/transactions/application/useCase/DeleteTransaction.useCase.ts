import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import TransactionUseCase from "./Transaction.useCase";
import TransactionNotFoundException from "../../domain/exceptions/TransactionNotFound.exception";

export default class DeleteTransactionUseCase extends TransactionUseCase implements UseCaseInterface {
    async execute(userId: number, id: number) {

        const transaction = await this.transactionRepository.findByIdAndUserId(id, userId)

        if (!transaction) {
            throw new TransactionNotFoundException(id)
        }

        await this.transactionRepository.delete(transaction)

    }
}