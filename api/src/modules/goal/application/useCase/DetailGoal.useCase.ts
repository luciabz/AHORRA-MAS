import GoalUseCase from "./Goal.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import GoalNotFoundException from "../../domain/exceptions/GoalNotFound.exception";

export default class DetailGoalUseCase extends GoalUseCase implements UseCaseInterface {
    async execute(userId: number, goalId: number) {
        const goal = await this.goalRepository.findById(goalId)

        if (!goal) throw new GoalNotFoundException(goalId)

        if (goal.userId !== userId) throw new GoalNotFoundException(goalId)

        return goal

    }
}