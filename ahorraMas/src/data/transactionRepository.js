import axiosInstance from '../infrastructure/api/axiosInstance';

export const getTransactions = async () => {
  const { data } = await axiosInstance.get('/api/v1/transaction');
  return data;
};


export const createTransaction = async (payload) => {
  const { data } = await axiosInstance.post('/api/v1/transaction', payload);
  return data;
};

export const updateTransaction = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/api/v1/transaction/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id) => {
  const { data } = await axiosInstance.delete(`/api/v1/transaction/${id}`);
  return data;
}
export const getTransactionById = async (id) => {
  const { data } = await axiosInstance.get(`/api/v1/transaction/${id}`);
  return data;
}
