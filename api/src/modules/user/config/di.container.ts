import LoginUseCase from "../application/useCases/Login.useCase";
import {UserRepositoryImpl} from "../infrastructure/database/User.repository.impl";
import Argon2HashProvider from "../infrastructure/argon2.hashProvider";
import RegisterUseCase from "../application/useCases/Register.useCase";
import {jwtProviderImpl} from "../../token/config/di.container";
import UserDetailUseCase from "../application/useCases/UserDetail.useCase";
import Application from "../../../infrastructure/Application";
import SystemException from "../../../share/exceptions/SystemException";
import User from "../domain/entity/User";

const database = Application.instance.database

if (!database) throw new SystemException("Database not found")

const hashProviderImpl = new Argon2HashProvider()
const userRepository = new UserRepositoryImpl(database.datasource.getRepository(User))

export const loginUseCase = new LoginUseCase(userRepository, hashProviderImpl, jwtProviderImpl)
export const registerUseCase = new RegisterUseCase(userRepository, hashProviderImpl)
export const userDetailUseCase = new UserDetailUseCase(userRepository, hashProviderImpl)