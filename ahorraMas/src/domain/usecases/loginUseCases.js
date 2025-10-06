import { authRepository } from '../../data/authRepository';

export async function loginUser({ name, password }) {
  return await authRepository.login({ name, password });
}

export async function registerUser({ name, email, password }) {
    return await authRepository.register({ name, email, password });
    }

    