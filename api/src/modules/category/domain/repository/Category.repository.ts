import RepositoryInterface from "../../../../share/interfaces/Repository.interface";
import Category from "../entity/Category";

export interface CategoryRepository extends RepositoryInterface<Category> {
    findByIdAndUserId(id: number, userId: number): Promise<Category | null>;

    findByUserId(userId: number): Promise<Category[]>;
}