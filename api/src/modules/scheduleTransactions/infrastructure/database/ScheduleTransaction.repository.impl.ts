import ScheduleTransaction from "../../domain/entity/ScheduleTransaction";
import {ScheduleTransactionRepository} from "../../domain/repository/ScheduleTransaction.repository";
import {Repository} from "typeorm";

export default class ScheduleTransactionRepositoryImpl implements ScheduleTransactionRepository {

    constructor(private readonly repository: Repository<ScheduleTransaction>) {
    }

    findByUserId(userId: number): Promise<ScheduleTransaction[]> {
        return this.repository.find({where: {userId}});
    }

    findByIdAndUserId(id: number, userId: number): Promise<ScheduleTransaction | null> {
        return this.repository.findOne({where: {userId, id}});
    }

    findById(id: number): Promise<ScheduleTransaction | null> {
        return this.repository.findOne({where: {id}});
    }

    save(entity: ScheduleTransaction): Promise<ScheduleTransaction> {
        return this.repository.save(entity);
    }

    async delete(entity: ScheduleTransaction): Promise<void> {
        await this.repository.delete(entity.id)
    }
}