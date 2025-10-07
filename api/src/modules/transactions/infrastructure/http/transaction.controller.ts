import controllerBuilder from "../../../../share/utils/controllerBuilder";
import {
    createTransactionUseCase, deleteTransactionUseCase,
    detailTransactionUseCase,
    listTransactionUseCase,
    updateTransactionUseCase
} from "../../config/di.container";
import CreateTransactionDto from "../../application/dto/input/CreateTransaction.dto";

export const listTransactionsController = controllerBuilder((_, {locals}) => {
    return listTransactionUseCase.execute(locals.token!.sub)
})

export const detailTransactionsController = controllerBuilder(({params}, {locals}) => {
    return detailTransactionUseCase.execute(locals.token!.sub, Number(params.id))
})

export const createTransactionsController = controllerBuilder(async ({body}, res) => {
    const userId = res.locals.token!.sub

    res.statusCode = 201

    const transactionDto = new CreateTransactionDto()

    transactionDto.amount = body.amount
    transactionDto.description = body.description
    transactionDto.categoryId = body.categoryId
    transactionDto.type = body.type
    transactionDto.regularity = body.regularity


    return await createTransactionUseCase.execute(userId, transactionDto)
})

export const updateTransactionsController = controllerBuilder(async ({body, params}, {locals}) => {
    const userId = locals.token!.sub
    const scheduleTransactionId = Number(params.id)

    const createScheduleTransactionDto: Partial<CreateTransactionDto> = new CreateTransactionDto()
    if (body.amount !== undefined) createScheduleTransactionDto.amount = body.amount
    if (body.description !== undefined) createScheduleTransactionDto.description = body.description
    if (body.categoryId !== undefined) createScheduleTransactionDto.categoryId = body.categoryId
    if (body.type !== undefined) createScheduleTransactionDto.type = body.type
    if (body.regularity !== undefined) createScheduleTransactionDto.regularity = body.regularity

    return await updateTransactionUseCase.execute(userId, scheduleTransactionId, createScheduleTransactionDto)
})

export const deleteTransactionsController = controllerBuilder(async ({params}, {locals}) => {
    await deleteTransactionUseCase.execute(locals.token!.sub, Number(params.id))
})
