import NotFoundException from "../../../../share/exceptions/NotFoundException";

export default class ScheduleTransactionNotFoundException extends NotFoundException {
    constructor(scheduleTransactionId: number) {
        super(`La transacción programada con ID ${scheduleTransactionId} no existe.`);
    }
}