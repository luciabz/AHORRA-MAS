import RepositoryInterface from "../../../../share/interfaces/Repository.interface";
import Transaction from "../entity/Transaction";

export interface TransactionRepository extends RepositoryInterface<Transaction> {
    findByUserId(userId: number): Promise<Transaction[]>;

    findByIdAndUserId(id: number, userId: number): Promise<Transaction | null>;
}