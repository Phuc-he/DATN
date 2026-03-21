import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Author } from '@/src/domain/entity/author.entity'; // Ensure this points to your domain entity, not Next.js types
import { AuthorRepository } from '@/src/domain/repository/author.repository';
import { Constants } from '@/src/shared/constans';

export class CreateAuthorUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(author: Author): Promise<Author> {
    return this.authorRepository.create(author);
  }
}

export class GetAllAuthorsUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(): Promise<Author[]> {
    return this.authorRepository.findAll();
  }
}

export class GetAuthorUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(id: number): Promise<Author> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new Error(`Author with ID ${id} not found`);
    }
    return author;
  }
}

export class UpdateAuthorUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(
    id: number,
    data: Partial<Author>,
  ): Promise<Author | null> {
    const updatedAuthor = await this.authorRepository.update(id, data);
    if (!updatedAuthor) {
      throw new Error(`Author with ID ${id} not found`);
    }
    return updatedAuthor;
  }
}

export class DeleteAuthorUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.authorRepository.delete(id);
    if (!deleted) {
      throw new Error(`Author with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

export class GetAuthorsByPageUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Author>> {
    return this.authorRepository.findByPage(page, limit);
  }
}

export class SearchAuthorsUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Author>> {
    return this.authorRepository.search(query, page, limit);
  }
}