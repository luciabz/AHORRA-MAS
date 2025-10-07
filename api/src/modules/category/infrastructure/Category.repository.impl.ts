import Category from "../domain/entity/Category";
import {CategoryRepository} from "../domain/repository/Category.repository";
import {Repository} from "typeorm";

export default class CategoryRepositoryImpl implements CategoryRepository {

    constructor(private readonly categoryRepoDatasource: Repository<Category>) {
    }

    findByIdAndUserId(id: number, userId: number): Promise<Category | null> {
        return this.categoryRepoDatasource.findOne({where: {id, userId}, withDeleted: false});
    }

    findByUserId(userId: number): Promise<Category[]> {
        return this.categoryRepoDatasource.find({where: {userId: userId}, withDeleted: false});
    }

    findById(id: number): Promise<Category | null> {
        return this.categoryRepoDatasource.findOne({where: {id}, withDeleted: false});
    }

    save(entity: Category): Promise<Category> {
        return this.categoryRepoDatasource.save(entity);
    }

    async delete(entity: Category): Promise<void> {
        await this.categoryRepoDatasource.softDelete(entity.id)
    }

}