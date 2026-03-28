import { Book } from "@/src/domain/entity/book.entity";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { BookPageResponse, BookProto, BookProtoList } from "@/src/generated/schema";
import { BookRepository } from "@/src/domain/repository/book.repository";
import { PaginatedResult } from "@/src/domain/entity/paginated.result";

export class BookRepositoryImpl extends BaseRepositoryImpl<Book> implements BookRepository {
  protected listProto = BookProtoList;
  protected proto = BookProto;

  protected pageProto = BookPageResponse;

  constructor() {
    super('api/books');
  }
  async getCategoryStats(categoryId: number): Promise<number> {
    const response = await this.api.get(`/${this.endpoint}/category/${categoryId}/count`, {
      // Override global Protobuf settings for this specific call
      responseType: 'text',
      headers: {
        'Accept': 'application/json', // Spring returns the Long as a JSON-compatible number
      }
    });

    // Axios will return the number as a string or number depending on the responseType 'text'
    return Number(response.data);
  }
  async getBooksByAuthor(
    authorId: string | number,
    page: number = 0,
    limit: number = 10
  ): Promise<PaginatedResult<Book>> {
    const response = await this.api.get(`/${this.endpoint}/author/${authorId}`, {
      params: {
        page,
        size: limit // 'limit' in TS maps to 'size' in Spring Pageable
      },
    });

    // Decode binary Protobuf data
    const decoded = this.pageProto.decode(new Uint8Array(response.data));

    // mapToPaginatedResult is accessible from BaseRepositoryImpl
    return this.mapToPaginatedResult(decoded);
  }
}