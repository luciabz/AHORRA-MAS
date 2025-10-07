import CreateGoalUseCase from "../application/useCase/CreateGoal.useCase";
import UpdateGoalUseCase from "../application/useCase/UpdateGoal.useCase";
import DeleteGoalUseCase from "../application/useCase/DeleteGoal.useCase";
import ListGoalUseCase from "../application/useCase/ListGoal.useCase";
import DetailGoalUseCase from "../application/useCase/DetailGoal.useCase";
import GoalRepositoryImpl from "../infrastructure/Goal.repository.impl";
import Application from "../../../infrastructure/Application";
import SystemException from "../../../share/exceptions/SystemException";
import Goal from "../domain/entity/Goal";

const database = Application.instance.database

if (!database) throw new SystemException("Database not found")

const goalRepository = new GoalRepositoryImpl(database.datasource.getRepository(Goal))

export const createGoalUseCase = new CreateGoalUseCase(goalRepository)
export const updateGoalUseCase = new UpdateGoalUseCase(goalRepository)
export const deleteGoalUseCase = new DeleteGoalUseCase(goalRepository)
export const detailGoalUseCase = new DetailGoalUseCase(goalRepository)
export const listGoalUseCase = new ListGoalUseCase(goalRepository)