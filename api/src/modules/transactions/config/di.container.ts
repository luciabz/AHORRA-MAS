import Application from "../../../infrastructure/Application";
import SystemException from "../../../share/exceptions/SystemException";
import Transaction from "../domain/entity/Transaction";
import TransactionRepositoryImpl from "../infrastructure/database/Transaction.repository.impl";
import ListTransactionUseCase from "../application/useCase/ListTransaction.useCase";
import DetailTransactionUseCase from "../application/useCase/DetailTransaction.useCase";
import CreateTransactionUseCase from "../application/useCase/CreateTransaction.useCase";
import UpdateTransactionUseCase from "../application/useCase/UpdateTransaction.useCase";
import DeleteTransactionUseCase from "../application/useCase/DeleteTransaction.useCase";

const database = Application.instance.database

if (!database) throw new SystemException("Database not found")

const transactionRepositoryImpl = new TransactionRepositoryImpl(database.datasource.getRepository(Transaction))

export const listTransactionUseCase = new ListTransactionUseCase(transactionRepositoryImpl)
export const detailTransactionUseCase = new DetailTransactionUseCase(transactionRepositoryImpl)
export const createTransactionUseCase = new CreateTransactionUseCase(transactionRepositoryImpl)
export const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepositoryImpl)
export const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepositoryImpl)