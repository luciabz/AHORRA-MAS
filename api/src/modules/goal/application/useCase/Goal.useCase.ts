import {GoalRepository} from "../../domain/repository/Goal.repository";

export default abstract class GoalUseCase {
    constructor(protected readonly goalRepository: GoalRepository) {
    }
}