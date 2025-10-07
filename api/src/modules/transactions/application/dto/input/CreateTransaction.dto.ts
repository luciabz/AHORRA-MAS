import {TransactionTypeEnum} from "../../../../../share/enums/TransactionType.enum";
import {TransactionRegularityEnum} from "../../../../../share/enums/TransactionRegularity.enum";

export default class CreateTransactionDto {
    categoryId: number
    type: TransactionTypeEnum
    regularity: TransactionRegularityEnum
    description: string
    amount: number
}