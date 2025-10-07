import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import UserUseCase from "./User.useCase";
import User from "../../domain/entity/User";

export default class RegisterUseCase extends UserUseCase implements UseCaseInterface {

    async execute(name: string, email: string, password: string): Promise<void> {
        const user = new User()

        user.name = name
        user.email = email

        const existUserNameProm = this.userRepository.findByUsername(name)
        const existUserEmailProm = this.userRepository.findByEmail(email)

        const [existUserName, existUserEmail] = await Promise.all([existUserNameProm, existUserEmailProm])

        if (existUserName) throw new Error("Nombre de usuario existente")
        if (existUserEmail) throw new Error("Correo electrónico existente")

        user.password = await this.hashProvider.hash(password)

        await this.userRepository.save(user)
    }

}