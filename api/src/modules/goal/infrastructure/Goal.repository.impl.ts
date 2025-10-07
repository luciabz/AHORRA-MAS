import Goal from "../domain/entity/Goal";
import {GoalRepository} from "../domain/repository/Goal.repository";
import {Repository} from "typeorm";


export default class GoalRepositoryImpl implements GoalRepository {
    constructor(private readonly goalRepository: Repository<Goal>) {
    }

    listByUserId(userId: number): Promise<Goal[]> {
        return this.goalRepository.find({where: {userId}});
    }

    findById(id: number): Promise<Goal | null> {
        return this.goalRepository.findOne({where: {id}});
    }

    save(entity: Goal): Promise<Goal> {
        return this.goalRepository.save(entity)
    }

    async delete(entity: Goal): Promise<void> {
        await this.goalRepository.delete(entity.id);
    }

}