import { Book } from '@/src/domain/entity/book.entity';
import { BookRepository } from '@/src/domain/repository/book.repository';
import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Constants } from '@/src/shared/constans';

export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(book: Book): Promise<Book> {
    return this.bookRepository.create(book);
  }
}

export class GetBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error(`Book with ID ${id} not found`);
    }
    return book;
  }
}

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: number, data: Partial<Book>): Promise<Book | null> {
    const updatedBook = await this.bookRepository.update(id, data);
    if (!updatedBook) {
      throw new Error(`Book with ID ${id} not found or update failed`);
    }
    return updatedBook;
  }
}

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.bookRepository.delete(id);
    if (!deleted) {
      throw new Error(`Book with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

export class GetBooksByPageUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Book>> {
    return this.bookRepository.findByPage(page, limit);
  }
}

export class SearchBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Book>> {
    return this.bookRepository.search(query, page, limit);
  }
}

/**
 * Custom UseCase for filtering books by a specific Author.
 */
export class GetBooksByAuthorUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(
    authorId: string, // Passed from URL or selection
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Book>> {
    return this.bookRepository.getBooksByAuthor(authorId, page, limit);
  }
}