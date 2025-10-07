import {UserRepository} from "../../domain/repository/User.repository";
import {HashProviderInterface} from "../../domain/interface/hashProvider.interface";

export default abstract class UserUseCase {
    constructor(protected readonly userRepository: UserRepository, protected readonly hashProvider: HashProviderInterface) {
    }


}