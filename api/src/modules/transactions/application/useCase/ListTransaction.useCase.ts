import TransactionUseCase from "./Transaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";

export default class ListTransactionUseCase extends TransactionUseCase implements UseCaseInterface {
    execute(userId: number) {
        return this.transactionRepository.findByUserId(userId);
    }
}