import TransactionUseCase from "./Transaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import TransactionNotFoundException from "../../domain/exceptions/TransactionNotFound.exception";

export default class DetailTransactionUseCase extends TransactionUseCase implements UseCaseInterface {
    async execute(userId: number, id: number) {
        const transaction = await this.transactionRepository.findByIdAndUserId(id, userId);

        if (!transaction) throw new TransactionNotFoundException(id)

        return transaction
    }
}