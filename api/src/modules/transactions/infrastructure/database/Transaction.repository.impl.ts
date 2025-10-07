import {Repository} from "typeorm";
import Transaction from "../../domain/entity/Transaction";
import {TransactionRepository} from "../../domain/repository/Transaction.repository";

export default class TransactionRepositoryImpl implements TransactionRepository {

    constructor(private readonly repository: Repository<Transaction>) {
    }

    findByUserId(userId: number): Promise<Transaction[]> {
        return this.repository.find({where: {userId}});
    }

    findByIdAndUserId(id: number, userId: number): Promise<Transaction | null> {
        return this.repository.findOne({where: {userId, id}});
    }

    findById(id: number): Promise<Transaction | null> {
        return this.repository.findOne({where: {id}});
    }

    save(entity: Transaction): Promise<Transaction> {
        return this.repository.save(entity);
    }

    async delete(entity: Transaction): Promise<void> {
        await this.repository.delete(entity.id)
    }
}