import CategoryUseCase from "./Category.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import CreateCategoryDto from "../dto/input/CreateCategory.dto";
import Category from "../../domain/entity/Category";

export default class CreateCategoryUseCase extends CategoryUseCase implements UseCaseInterface {
    async execute(userId: number, createCategoryDto: CreateCategoryDto) {
        const category = new Category()

        category.name = createCategoryDto.name
        category.description = createCategoryDto.description
        category.userId = userId
        category.modificable = true

        return this.categoryRepository.save(category)
    }
}