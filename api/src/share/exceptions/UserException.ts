import SystemException from "./SystemException";

export default class UserException extends SystemException {
    constructor(message: string) {
        super(message);
        this.name = "UserException";
    }
}
