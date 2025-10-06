import { scheduleRepository } from '../../data/scheduleRepository';

export async function createSchedule({amount, description, categoryId, endDate, type, regularity, nextOccurrence, periodicity}) {
  return await scheduleRepository.create({ amount, description, categoryId, endDate, type, regularity, nextOccurrence, periodicity });
}
export async function getSchedules() {
    return await scheduleRepository.get();
    }
export async function updateSchedule(id, { amount, description, categoryId, endDate, type, regularity, nextOccurrence, periodicity }) {
    return await scheduleRepository.update(id, { amount, description, categoryId, endDate, type, regularity, nextOccurrence, periodicity });
    }
export async function deleteSchedule(id) {
    return await scheduleRepository.delete(id);
    }
export async function getScheduleById(id) {
    return await scheduleRepository.getById(id);
    }

