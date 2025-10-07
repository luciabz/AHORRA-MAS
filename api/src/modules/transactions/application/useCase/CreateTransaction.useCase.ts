import TransactionUseCase from "./Transaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CreateTransactionDto from "../dto/input/CreateTransaction.dto";
import Transaction from "../../domain/entity/Transaction";

export default class CreateTransactionUseCase extends TransactionUseCase implements UseCaseInterface {
    async execute(userId: number, createTransactionDto: CreateTransactionDto) {
        const transaction = new Transaction()

        transaction.userId = userId
        transaction.categoryId = createTransactionDto.categoryId
        transaction.type = createTransactionDto.type
        transaction.regularity = createTransactionDto.regularity
        transaction.description = createTransactionDto.description
        transaction.amount = createTransactionDto.amount

        return this.transactionRepository.save(transaction)
    }
}