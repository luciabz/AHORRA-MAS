import GoalUseCase from "./Goal.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";

export default class ListGoalUseCase extends GoalUseCase implements UseCaseInterface {
    execute(userId: number) {
        return this.goalRepository.listByUserId(userId)
    }
}