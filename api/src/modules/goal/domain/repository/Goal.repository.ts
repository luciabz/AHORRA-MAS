import RepositoryInterface from "../../../../share/interfaces/Repository.interface";
import Goal from "../entity/Goal";

export interface GoalRepository extends RepositoryInterface<Goal> {
    listByUserId(userId: number): Promise<Goal[]>;
}