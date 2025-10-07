import ListCategoryUseCase from "../application/useCase/ListCategory.useCase";
import CategoryRepositoryImpl from "../infrastructure/Category.repository.impl";
import DetailCategoryUseCase from "../application/useCase/DetailCategory.useCase";
import CreateCategoryUseCase from "../application/useCase/CreateCategory.useCase";
import UpdateCategoryUseCase from "../application/useCase/UpdateCategory.useCase";
import DeleteCategoryUseCase from "../application/useCase/DeleteCategory.useCase";
import Application from "../../../infrastructure/Application";
import SystemException from "../../../share/exceptions/SystemException";
import Category from "../domain/entity/Category";

const database = Application.instance.database

if (!database) throw new SystemException("Database not found")

const categoryRepositoryImpl = new CategoryRepositoryImpl(database.datasource.getRepository(Category))

export const listCategoryUseCase = new ListCategoryUseCase(categoryRepositoryImpl)
export const detailCategoryUseCase = new DetailCategoryUseCase(categoryRepositoryImpl)
export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryImpl)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepositoryImpl)
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepositoryImpl)