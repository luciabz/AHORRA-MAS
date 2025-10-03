import { CreateCategoryDTO, UpdateCategoryDTO } from '../dto/CategoryDTO.js';
import { Category } from '../../domain/models/Category.js';

/**
 * CreateCategoryUseCase - Caso de uso para crear categorías
 */
export class CreateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, categoryData) {
    // 1. Crear y validar DTO
    const dto = new CreateCategoryDTO(categoryData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 2. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 3. Verificar unicidad del nombre para el usuario
    const isUnique = await this.categoryRepository.isNameUnique(userId, sanitizedData.name);
    if (!isUnique) {
      throw new Error('Ya existe una categoría con este nombre');
    }

    // 4. Crear entidad del dominio
    const category = new Category({
      ...sanitizedData,
      userId
    });

    // 5. Validaciones del dominio
    if (!category.isValid()) {
      throw new Error('Datos de categoría inválidos');
    }

    // 6. Guardar
    const createdCategory = await this.categoryRepository.create(category);
    return Category.fromApiData(createdCategory);
  }
}

/**
 * GetCategoriesUseCase - Caso de uso para obtener categorías
 */
export class GetCategoriesUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, type = null) {
    // 1. Obtener categorías del usuario
    let categories;
    
    if (type) {
      // Validar tipo
      if (!['income', 'expense'].includes(type)) {
        throw new Error('Tipo debe ser income o expense');
      }
      categories = await this.categoryRepository.findByType(userId, type);
    } else {
      categories = await this.categoryRepository.findByUserId(userId);
    }

    // 2. Convertir a entidades del dominio
    return categories.map(c => Category.fromApiData(c));
  }
}

/**
 * UpdateCategoryUseCase - Caso de uso para actualizar categorías
 */
export class UpdateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, categoryId, updateData) {
    // 1. Verificar que la categoría existe y pertenece al usuario
    const existingCategory = await this.categoryRepository.findById(categoryId);
    if (!existingCategory) {
      throw new Error('Categoría no encontrada');
    }
    
    if (existingCategory.userId !== userId) {
      throw new Error('No tienes permisos para actualizar esta categoría');
    }

    // 2. Crear y validar DTO
    const dto = new UpdateCategoryDTO(updateData);
    const validation = dto.validate();
    
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // 3. Sanitizar datos
    const sanitizedData = dto.sanitize();

    // 4. Verificar unicidad del nombre si se actualiza
    if (sanitizedData.name) {
      const isUnique = await this.categoryRepository.isNameUnique(
        userId, 
        sanitizedData.name, 
        categoryId
      );
      if (!isUnique) {
        throw new Error('Ya existe una categoría con este nombre');
      }
    }

    // 5. Actualizar
    const updatedCategory = await this.categoryRepository.update(
      categoryId, 
      sanitizedData
    );
    
    return Category.fromApiData(updatedCategory);
  }
}

/**
 * DeleteCategoryUseCase - Caso de uso para eliminar categorías
 */
export class DeleteCategoryUseCase {
  constructor(categoryRepository, transactionRepository) {
    this.categoryRepository = categoryRepository;
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, categoryId) {
    // 1. Verificar que la categoría existe y pertenece al usuario
    const existingCategory = await this.categoryRepository.findById(categoryId);
    if (!existingCategory) {
      throw new Error('Categoría no encontrada');
    }
    
    if (existingCategory.userId !== userId) {
      throw new Error('No tienes permisos para eliminar esta categoría');
    }

    // 2. Verificar si se puede eliminar (sin transacciones asociadas)
    const canDelete = await this.categoryRepository.canDelete(categoryId);
    if (!canDelete) {
      throw new Error('No se puede eliminar la categoría porque tiene transacciones asociadas');
    }

    // 3. Eliminar
    await this.categoryRepository.delete(categoryId);
    return true;
  }
}

/**
 * CreateDefaultCategoriesUseCase - Crear categorías por defecto para nuevos usuarios
 */
export class CreateDefaultCategoriesUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId) {
    // 1. Obtener categorías por defecto
    const defaultCategories = Category.createDefaultCategories();

    // 2. Crear cada categoría
    const createdCategories = [];
    
    for (const categoryData of defaultCategories) {
      try {
        // Verificar que no exista ya una categoría con este nombre
        const isUnique = await this.categoryRepository.isNameUnique(userId, categoryData.name);
        
        if (isUnique) {
          const category = new Category({
            ...categoryData,
            userId
          });
          
          const created = await this.categoryRepository.create(category);
          createdCategories.push(Category.fromApiData(created));
        }
      } catch (error) {
        console.warn(`Error creando categoría por defecto ${categoryData.name}:`, error);
        // Continuar con las demás categorías
      }
    }

    return createdCategories;
  }
}
