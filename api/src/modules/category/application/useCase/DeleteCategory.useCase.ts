import CategoryUseCase from "./Category.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CategoryNotFoundException from "../../domain/exceptions/CategoryNotFound.exception";

export default class DeleteCategoryUseCase extends CategoryUseCase implements UseCaseInterface {
    async execute(categoryId: number, userId: number) {
        const category = await this.categoryRepository.findByIdAndUserId(categoryId, userId)

        if (!category) throw new CategoryNotFoundException(categoryId)

        await this.categoryRepository.delete(category)

    }
}