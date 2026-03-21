/**
 * Represents the Product Category domain model.
 * Matches org.datn.backend.domain.entity.Category
 */
export interface Category {
  id?: number;          // Long? in Kotlin maps to optional number
  name: string;
  description?: string; // String? maps to optional string
  image?: string; // String? maps to optional string
  createdAt?: string;
}

/**
 * Initial state for category forms or filters
 */
export const EmptyCategory: Category = {
  name: '',
  description: '',
  image: '',
  createdAt: '',
};