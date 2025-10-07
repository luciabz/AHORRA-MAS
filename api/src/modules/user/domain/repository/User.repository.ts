import RepositoryInterface from "../../../../share/interfaces/Repository.interface";
import User from "../entity/User";

export interface UserRepository extends RepositoryInterface<User> {
    findByUsername(username: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;
}