import {TransactionTypeEnum} from "../../../../../share/enums/TransactionType.enum";
import {TransactionRegularityEnum} from "../../../../../share/enums/TransactionRegularity.enum";

export default class CreateScheduleTransactionDto {
    categoryId: number
    type: TransactionTypeEnum
    regularity: TransactionRegularityEnum
    description: string
    amount: number
    periodicity: `${number} ${'day' | 'week' | 'month' | 'year'}`
    nextOccurrence: Date
    endDate: Date | null
}