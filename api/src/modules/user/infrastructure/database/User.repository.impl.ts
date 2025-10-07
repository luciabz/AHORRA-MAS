import User from "../../domain/entity/User";
import {UserRepository} from "../../domain/repository/User.repository";
import {Repository} from "typeorm";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly userRepository: Repository<User>) {
    }

    async delete(entity: User): Promise<void> {
        await this.userRepository.delete(entity.id);
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({where: {email}});
    }

    findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({where: {id}});
    }

    findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({where: {name: username}});
    }

    save(entity: User): Promise<User> {
        return this.userRepository.save(entity)
    }
}

