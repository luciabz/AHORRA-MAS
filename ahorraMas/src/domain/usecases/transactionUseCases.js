import { transactionRepository } from '../../data/transactionRepository';

export async function createTransaction({ amount, description, categoryId, type, regularity }) {
  return await transactionRepository.create({ amount, description, categoryId, type, regularity });
}
export async function getTransactions() {
    return await transactionRepository.get();
}
export async function updateTransaction(id, { amount, description, categoryId, type, regularity }) {
    return await transactionRepository.update(id, { amount, description, categoryId, type, regularity });
}
export async function deleteTransaction(id) {
    return await transactionRepository.delete(id);
}
export async function getTransactionById(id) {
    return await transactionRepository.getById(id);
    }

