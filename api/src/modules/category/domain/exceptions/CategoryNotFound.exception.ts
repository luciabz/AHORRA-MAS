import NotFoundException from "../../../../share/exceptions/NotFoundException";

export default class CategoryNotFoundException extends NotFoundException {
    constructor(public categoryId: number) {
        super(`Categoria con id ${categoryId} no encontrada`);
    }
}