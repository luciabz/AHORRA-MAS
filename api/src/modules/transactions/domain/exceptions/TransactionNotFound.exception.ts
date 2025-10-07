import NotFoundException from "../../../../share/exceptions/NotFoundException";

export default class TransactionNotFoundException extends NotFoundException {
    constructor(transactionId: number) {
        super(`La transacción con ID ${transactionId} no existe.`);
    }
}