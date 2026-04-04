import { Book } from "../entity/book.entity";
import { PaginatedResult } from "../entity/paginated.result";
import { BaseRepository } from "./base.repository";

export abstract class BookRepository extends BaseRepository<Book, number> {
  abstract getBooksByAuthor(
    authorId: number,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<Book>>;
  abstract getCategoryStats(categotyId: number): Promise<number>
}
