export default class SystemException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserException";
        Object.setPrototypeOf(this, SystemException.prototype);
        // Ensure the stack trace is correctly captured
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SystemException);
        }
    }
}
