import ScheduleTransactionRepositoryImpl from "../infrastructure/database/ScheduleTransaction.repository.impl";
import ListScheduleTransactionUseCase from "../application/useCase/ListScheduleTransaction.useCase";
import DetailScheduleTransactionUseCase from "../application/useCase/DetailScheduleTransaction.useCase";
import CreateScheduleTransactionUseCase from "../application/useCase/CreateScheduleTransaction.useCase";
import UpdateScheduleTransactionUseCase from "../application/useCase/UpdateScheduleTransaction.useCase";
import DeleteScheduleTransactionUseCase from "../application/useCase/DeleteScheduleTransaction.useCase";
import Application from "../../../infrastructure/Application";
import SystemException from "../../../share/exceptions/SystemException";
import ScheduleTransaction from "../domain/entity/ScheduleTransaction";

const database = Application.instance.database

if (!database) throw new SystemException("Database not found")

const scheduleTransactionRepository = new ScheduleTransactionRepositoryImpl(database.datasource.getRepository(ScheduleTransaction))

export const listScheduleTransactionUseCase = new ListScheduleTransactionUseCase(scheduleTransactionRepository)
export const detailScheduleTransactionUseCase = new DetailScheduleTransactionUseCase(scheduleTransactionRepository)
export const createScheduleTransactionUseCase = new CreateScheduleTransactionUseCase(scheduleTransactionRepository)
export const updateScheduleTransactionUseCase = new UpdateScheduleTransactionUseCase(scheduleTransactionRepository)
export const deleteScheduleTransactionUseCase = new DeleteScheduleTransactionUseCase(scheduleTransactionRepository)