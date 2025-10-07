import {TransactionRepository} from "../../domain/repository/Transaction.repository";

export default abstract class TransactionUseCase {
    constructor(protected readonly transactionRepository: TransactionRepository) {
    }
}