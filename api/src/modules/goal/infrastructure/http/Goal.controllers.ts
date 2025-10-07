import controllerBuilder from "../../../../share/utils/controllerBuilder";
import {
    createGoalUseCase,
    deleteGoalUseCase,
    detailGoalUseCase,
    listGoalUseCase,
    updateGoalUseCase
} from "../../config/di.container";
import CreateGoalDto from "../../application/dtos/input/CreateGoal.dto";

export const listGoalController = controllerBuilder(async (_, {locals}) => {
    const userId = locals.token!.sub

    return await listGoalUseCase.execute(Number(userId))
})

export const getGoalController = controllerBuilder(async (req, {locals}) => {
    const userId = locals.token!.sub
    const goalId = Number(req.params.id)

    return await detailGoalUseCase.execute(userId, goalId)

})

export const createGoalController = controllerBuilder(async (req, {locals}) => {
    const userId = locals.token!.sub
    const createGoalDto = new CreateGoalDto()

    createGoalDto.deadline = req.body.deadline
    createGoalDto.description = req.body.description
    createGoalDto.title = req.body.title
    createGoalDto.targetAmount = req.body.targetAmount

    return await createGoalUseCase.execute(userId, createGoalDto)

})

export const updateGoalController = controllerBuilder(async (req, {locals}) => {
    const userId = locals.token!.sub
    const goalId = Number(req.params.id)
    const updateGoalDto: Partial<CreateGoalDto> = {}

    if (req.body.deadline) updateGoalDto.deadline = req.body.deadline
    if (req.body.description) updateGoalDto.description = req.body.description
    if (req.body.title) updateGoalDto.title = req.body.title
    if (req.body.targetAmount) updateGoalDto.targetAmount = req.body.targetAmount

    return updateGoalUseCase.execute(userId, goalId, updateGoalDto)
})

export const deleteGoalController = controllerBuilder(async (req, {locals}) => {
    const userId = locals.token!.sub
    const goalId = Number(req.params.id)

    await deleteGoalUseCase.execute(userId, goalId)
})
