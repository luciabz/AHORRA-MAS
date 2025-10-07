import RepositoryInterface from "../../../../share/interfaces/Repository.interface";
import ScheduleTransaction from "../entity/ScheduleTransaction";

export interface ScheduleTransactionRepository extends RepositoryInterface<ScheduleTransaction> {
    findByUserId(userId: number): Promise<ScheduleTransaction[]>;

    findByIdAndUserId(id: number, userId: number): Promise<ScheduleTransaction | null>;
}