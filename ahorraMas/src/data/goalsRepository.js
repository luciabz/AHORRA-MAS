import axiosInstance from '../infrastructure/api/axiosInstance';

export const getGoal = async () => {
  try {
    const { data } = await axiosInstance.get('/api/v1/goal');
    return data;
  } catch (error) {
    
    if (error.response?.status === 401 || error.response?.status === 404) {
      console.warn('🎯 Goals endpoint not available, using empty array');
      return [];
    }
    
    throw error;
  }
};


export const createGoal = async (payload) => {
  const { data } = await axiosInstance.post('/api/v1/goal', payload);
  return data;
};

export const updateGoal = async (id, payload) => {
  try {
    console.log(`📤 Enviando PATCH a /api/v1/goal/${id}:`, payload);
    const { data } = await axiosInstance.patch(`/api/v1/goal/${id}`, payload);
    return data;
  } catch (error) {
    
    throw error;
  }
};

export const deleteGoal = async (id) => {
  const { data } = await axiosInstance.delete(`/api/v1/goal/${id}`);
  return data;
};

export const getGoalById = async (id) => {
  const { data } = await axiosInstance.get(`/api/v1/goal/${id}`);
  return data;
};
