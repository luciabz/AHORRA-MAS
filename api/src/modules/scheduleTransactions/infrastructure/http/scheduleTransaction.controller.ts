import controllerBuilder from "../../../../share/utils/controllerBuilder";
import {
    createScheduleTransactionUseCase,
    deleteScheduleTransactionUseCase,
    detailScheduleTransactionUseCase,
    listScheduleTransactionUseCase, updateScheduleTransactionUseCase
} from "../../config/di.container";
import CreateScheduleTransactionDto from "../../application/dto/input/CreateScheduleTransaction.dto";

export const listScheduleTransactionsController = controllerBuilder((_, {locals}) => {
    return listScheduleTransactionUseCase.execute(locals.token!.sub)
})

export const detailScheduleTransactionsController = controllerBuilder(({params}, {locals}) => {
    return detailScheduleTransactionUseCase.execute(locals.token!.sub, Number(params.id))
})

export const createScheduleTransactionsController = controllerBuilder(async ({body}, res) => {
    const userId = res.locals.token!.sub

    res.statusCode = 201

    const createScheduleTransactionDto = new CreateScheduleTransactionDto()

    createScheduleTransactionDto.amount = body.amount
    createScheduleTransactionDto.description = body.description
    createScheduleTransactionDto.categoryId = body.categoryId
    createScheduleTransactionDto.endDate = body.endDate
    createScheduleTransactionDto.type = body.type
    createScheduleTransactionDto.regularity = body.regularity
    createScheduleTransactionDto.nextOccurrence = body.nextOccurrence
    createScheduleTransactionDto.periodicity = body.periodicity

    return await createScheduleTransactionUseCase.execute(userId, createScheduleTransactionDto)
})

export const updateScheduleTransactionsController = controllerBuilder(async ({body, params}, {locals}) => {
    const userId = locals.token!.sub
    const scheduleTransactionId = Number(params.id)

    const createScheduleTransactionDto: Partial<CreateScheduleTransactionDto> = new CreateScheduleTransactionDto()
    if (body.amount !== undefined) createScheduleTransactionDto.amount = body.amount
    if (body.description !== undefined) createScheduleTransactionDto.description = body.description
    if (body.categoryId !== undefined) createScheduleTransactionDto.categoryId = body.categoryId
    if (body.endDate !== undefined) createScheduleTransactionDto.endDate = body.endDate
    if (body.type !== undefined) createScheduleTransactionDto.type = body.type
    if (body.regularity !== undefined) createScheduleTransactionDto.regularity = body.regularity
    if (body.nextOccurrence !== undefined) createScheduleTransactionDto.nextOccurrence = body.nextOccurrence

    return await updateScheduleTransactionUseCase.execute(userId, scheduleTransactionId, createScheduleTransactionDto)
})

export const deleteScheduleTransactionsController = controllerBuilder(async ({params}, {locals}) => {
    await deleteScheduleTransactionUseCase.execute(locals.token!.sub, Number(params.id))
})
