import NotFoundException from "../../../../share/exceptions/NotFoundException";

export default class GoalNotFoundException extends NotFoundException {
    constructor(goalId: number) {
        super(`Meta con id ${goalId} no encontrada`);
    }
}