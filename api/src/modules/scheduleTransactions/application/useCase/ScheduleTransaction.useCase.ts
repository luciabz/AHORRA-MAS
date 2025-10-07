import {ScheduleTransactionRepository} from "../../domain/repository/ScheduleTransaction.repository";

export default abstract class ScheduleTransactionUseCase {
    constructor(protected readonly scheduleRepository: ScheduleTransactionRepository) {
    }
}