import {CategoryRepository} from "../../domain/repository/Category.repository";

export default abstract class CategoryUseCase {
    constructor(protected readonly categoryRepository: CategoryRepository) {
    }
}