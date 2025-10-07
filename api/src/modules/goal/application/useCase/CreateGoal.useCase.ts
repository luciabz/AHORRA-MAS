import GoalUseCase from "./Goal.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CreateGoalDto from "../dtos/input/CreateGoal.dto";
import Goal from "../../domain/entity/Goal";

export default class CreateGoalUseCase extends GoalUseCase implements UseCaseInterface {
    async execute(userId: number, createGoalDto: CreateGoalDto) {
        const goal = new Goal()

        goal.targetAmount = createGoalDto.targetAmount
        goal.description = createGoalDto.description
        goal.deadline = createGoalDto.deadline
        goal.title = createGoalDto.title
        goal.userId = userId
        goal.currentAmount = 0

        return this.goalRepository.save(goal)
    }

}