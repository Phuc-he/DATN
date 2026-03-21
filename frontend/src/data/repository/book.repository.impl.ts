import { Book } from "@/src/domain/entity/book.entity";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { BookPageResponse, BookProto } from "@/src/generated/schema";
import { BookRepository } from "@/src/domain/repository/book.repository";
import { PaginatedResult } from "@/src/domain/entity/paginated.result";

export class BookRepositoryImpl extends BaseRepositoryImpl<Book> implements BookRepository {
    protected proto = BookProto;

    protected pageProto = BookPageResponse;

    constructor() {
        super('api/books');
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