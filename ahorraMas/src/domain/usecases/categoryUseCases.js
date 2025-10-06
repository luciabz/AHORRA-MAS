import { categoryRepository} from '../../data/categoryRepository';

export async function createCategory({ name, description }) {
  return await categoryRepository.create({ name, description });
}
export async function getCategories() {
    return await categoryRepository.get();
}
export async function updateCategory(id, { name, description }) {
    return await categoryRepository.update(id, { name, description });
}
export async function deleteCategory(id) {
    return await categoryRepository.delete(id);
}
export async function getCategoryById(id) {
    return await categoryRepository.getById(id);
    }

