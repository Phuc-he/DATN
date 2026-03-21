import { Category } from '@/src/domain/entity/category.entity';
import { CategoryRepository } from '@/src/domain/repository/category.repository';
import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Constants } from '@/src/shared/constans';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(category: Category): Promise<Category> {
    return this.categoryRepository.create(category);
  }
}

export class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}

export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return category;
  }
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    id: number,
    data: Partial<Category>,
  ): Promise<Category | null> {
    const updatedCategory = await this.categoryRepository.update(id, data);
    if (!updatedCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new Error(`Category with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

export class GetCategoriesByPageUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Category>> {
    return this.categoryRepository.findByPage(page, limit);
  }
}

export class SearchCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Category>> {
    return this.categoryRepository.search(query, page, limit);
  }
}