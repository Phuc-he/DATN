export interface PaginatedResult<T> {
  content: T[];          // The list of items (Books, Authors, etc.)
  totalElements: number; // Total items in database
  totalPages: number;    // Total pages based on size
  pageNumber: number;    // Current page (0-indexed)
  pageSize: number;
}
