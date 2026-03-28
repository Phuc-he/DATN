import { Author } from "./author.entity";
import { Category } from "./category.entity";

export interface Book {
  id?: number;              // Long in Kotlin maps to number
  title: string;
  description?: string;     // String? maps to optional string
  price: number;            // BigDecimal maps to number (or string for high precision)
  stock: number;
  discount: number;         // BigDecimal.ZERO default handled in logic
  imageUrl?: string;

  // Relationships
  category?: Category;      // @ManyToOne
  author?: Author;          // @ManyToOne
  createdAt?: string; 
  isNotable?: boolean
}

/**
 * Utility for initializing a new book in a form
 */
export const EmptyBook: Book = {
  title: '',
  price: 0,
  stock: 0,
  discount: 0,
};