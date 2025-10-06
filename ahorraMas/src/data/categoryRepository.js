import axiosInstance from '../infrastructure/api/axiosInstance';

export const getCategory = async () => {
  const { data } = await axiosInstance.get('/api/v1/category');
  return data;
};


export const createCategory = async (payload) => {
  const { data } = await axiosInstance.post('/api/v1/category', payload);
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/api/v1/category/${id}`, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/api/v1/category/${id}`);
  return data;
}
export const getCategoryById = async (id) => {
  const { data } = await axiosInstance.get(`/api/v1/category/${id}`);
  return data;
}
