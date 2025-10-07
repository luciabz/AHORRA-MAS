import GoalUseCase from "./Goal.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CreateGoalDto from "../dtos/input/CreateGoal.dto";
import GoalNotFoundException from "../../domain/exceptions/GoalNotFound.exception";

export default class UpdateGoalUseCase extends GoalUseCase implements UseCaseInterface {
    async execute(userId: number, goalId: number, updateGoalDto: Partial<CreateGoalDto>): Promise<any> {
        const goal = await this.goalRepository.findById(goalId)

        if (!goal) throw new GoalNotFoundException(goalId)

        if (goal.userId !== userId) throw new GoalNotFoundException(goalId)

        if (updateGoalDto.title) goal.title = updateGoalDto.title
        if (updateGoalDto.description) goal.description = updateGoalDto.description
        if (updateGoalDto.deadline) goal.deadline = new Date(updateGoalDto.deadline)
        if (updateGoalDto.targetAmount) goal.targetAmount = updateGoalDto.targetAmount

        await this.goalRepository.save(goal)

        return goal
    }
}