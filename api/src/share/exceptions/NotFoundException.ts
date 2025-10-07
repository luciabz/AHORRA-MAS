import UserException from "./UserException";

export default class NotFoundException extends UserException {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundException";
    }
}
