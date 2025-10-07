import ScheduleTransactionUseCase from "./ScheduleTransaction.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";

export default class ListScheduleTransactionUseCase extends ScheduleTransactionUseCase implements UseCaseInterface {
    execute(userId: number) {
        return this.scheduleRepository.findByUserId(userId);
    }
}