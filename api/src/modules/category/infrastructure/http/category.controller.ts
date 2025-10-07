import controllerBuilder from "../../../../share/utils/controllerBuilder";
import {
    createCategoryUseCase,
    detailCategoryUseCase,
    listCategoryUseCase,
    updateCategoryUseCase
} from "../../config/di.container";
import CreateCategoryDto from "../../application/dto/input/CreateCategory.dto";

export const listCategoriesController = controllerBuilder(async (_, {locals}) => {
    return listCategoryUseCase.execute(locals.token!.sub)
})

export const detailCategoryController = controllerBuilder(async (req, {locals}) => {
    const id = parseInt(req.params.id!)

    return detailCategoryUseCase.execute(locals.token!.sub, id)
})

export const deleteCategoryController = controllerBuilder(async (req, res) => {
    const id = parseInt(req.params.id!)

    await detailCategoryUseCase.execute(res.locals.token!.sub, id)

    res.statusCode = 204
})

export const updateCategoryController = controllerBuilder(async (req, {locals}) => {
    const id = parseInt(req.params.id!)
    const updateCategoryDto: Partial<CreateCategoryDto> = {}

    if (req.body.name !== undefined) updateCategoryDto.name = req.body.name
    if (req.body.description !== undefined) updateCategoryDto.description = req.body.description

    return updateCategoryUseCase.execute(locals.token!.sub, id, updateCategoryDto)
})

export const createCategoryController = controllerBuilder(async (req, res) => {
    const createCategoryDto: CreateCategoryDto = {
        name: req.body.name,
        description: req.body.description
    }

    res.statusCode = 204

    return createCategoryUseCase.execute(res.locals.token!.sub, createCategoryDto)
})