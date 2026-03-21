import { PaginatedResult } from "../entity/paginated.result";

export abstract class BaseRepository<T, ID> {
  // Standard CRUD (ListCrudRepository)
  abstract create(item: T): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T | null>;
  abstract update(id: ID, item: Partial<T>): Promise<T | null>;
  abstract delete(id: ID): Promise<boolean>;

  // Paging and Sorting (ListPagingAndSortingRepository)
  abstract findByPage(
    page?: number,
    limit?: number,
    sort?: string // e.g., "id,desc"
  ): Promise<PaginatedResult<T>>;

  // Custom Search matching QueryByExampleExecutor logic
  abstract search(
    query: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<T>>;
}
