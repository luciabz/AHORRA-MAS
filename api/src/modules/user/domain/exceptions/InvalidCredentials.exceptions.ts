import UserException from "../../../../share/exceptions/UserException";

export default class InvalidCredentialsExceptions extends UserException {
    constructor(message: string = "Credenciales inválidas") {
        super(message);
    }
}