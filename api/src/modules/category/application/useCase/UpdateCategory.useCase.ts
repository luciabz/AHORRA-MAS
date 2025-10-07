import CategoryUseCase from "./Category.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CreateCategoryDto from "../dto/input/CreateCategory.dto";
import CategoryNotFoundException from "../../domain/exceptions/CategoryNotFound.exception";

export default class UpdateCategoryUseCase extends CategoryUseCase implements UseCaseInterface {
    async execute(userId: number, categoryId: number, updateCategoryId: Partial<CreateCategoryDto>) {
        const category = await this.categoryRepository.findByIdAndUserId(categoryId, userId)

        if (!category) throw new CategoryNotFoundException(categoryId)

        if (updateCategoryId.name) category.name = updateCategoryId.name
        if (updateCategoryId.description) category.description = updateCategoryId.description

        return this.categoryRepository.save(category)
    }
}