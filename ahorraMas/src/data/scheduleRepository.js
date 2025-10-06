import axiosInstance from '../infrastructure/api/axiosInstance';

export const getScheduleTransaction = async () => {
  const { data } = await axiosInstance.get('/api/v1/schedule-transaction');
  return data;
};


export const createScheduleTransaction = async (payload) => {
  const { data } = await axiosInstance.post('/api/v1/schedule-transaction', payload);
  return data;
};

export const updateScheduleTransaction = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/api/v1/schedule-transaction/${id}`, payload);
  return data;
};

export const deleteScheduleTransaction = async (id) => {
  const { data } = await axiosInstance.delete(`/api/v1/schedule-transaction/${id}`);
  return data;
}
export const getScheduleTransactionById = async (id) => {
  const { data } = await axiosInstance.get(`/api/v1/schedule-transaction/${id}`);
  return data;
}
