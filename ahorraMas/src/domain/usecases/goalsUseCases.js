import { goalsRepository } from '../../data/goalsRepository';

export async function createGoal({ title, description, targetAmount, deadline }) {
  return await goalsRepository.create({ title, description, targetAmount, deadline });
}
export async function getGoals() {
    return await goalsRepository.get();
    }
export async function updateGoal(id, { title, description, targetAmount, deadline }) {
    return await goalsRepository.update(id, { title, description, targetAmount, deadline });
    }
export async function deleteGoal(id) {
    return await goalsRepository.delete(id);
    }
export async function getGoalById(id) {
    return await goalsRepository.getById(id);
    }

