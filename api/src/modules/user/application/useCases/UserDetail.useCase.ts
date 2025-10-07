import UserUseCase from "./User.useCase";
import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";

export default class UserDetailUseCase extends UserUseCase implements UseCaseInterface {
    async execute(id: number) {
        const user = await this.userRepository.findById(id)

        if (!user) return null

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

}