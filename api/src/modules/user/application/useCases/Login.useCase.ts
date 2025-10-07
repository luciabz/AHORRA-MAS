import {UseCaseInterface} from "../../../../share/interfaces/UseCase.interface";
import UserUseCase from "./User.useCase";
import InvalidCredentialsExceptions from "../../domain/exceptions/InvalidCredentials.exceptions";
import {UserRepository} from "../../domain/repository/User.repository";
import {HashProviderInterface} from "../../domain/interface/hashProvider.interface";
import {JwtProviderInterface} from "../../domain/interface/JwtProvider.interface";

export default class LoginUseCase extends UserUseCase implements UseCaseInterface {

    constructor(userRepository: UserRepository, hashProvider: HashProviderInterface, private readonly jwtProvider: JwtProviderInterface) {
        super(userRepository, hashProvider);
    }

    async execute(username: string, password: string) {

        const user = await this.userRepository.findByUsername(username);
        if (!user) throw new InvalidCredentialsExceptions();

        if (!await this.hashProvider.compare(password, user.password)) throw new InvalidCredentialsExceptions()

        const token = this.jwtProvider.sign(user.id)

        return {token}
    }

}