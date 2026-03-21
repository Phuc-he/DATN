import axios, { AxiosInstance } from 'axios';
import { BaseRepository } from '@/src/domain/repository/base.repository';
import { PaginatedResult } from '@/src/domain/entity/paginated.result';

export abstract class BaseRepositoryImpl<T, ID = number> implements BaseRepository<T, ID> {
  protected readonly api: AxiosInstance;
  protected readonly endpoint: string;
  protected abstract proto: { 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encode: (message: any) => { finish: () => Uint8Array },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decode: (buffer: Uint8Array) => any 
  } | null;
  protected abstract pageProto: {
    decode: (buffer: Uint8Array) => unknown
  } | null;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.api = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        'Accept': 'application/x-protobuf',
      },
      responseType: 'arraybuffer', // Crucial for receiving Protobuf binary
    });
  }

  async search(
    query: string,
    page: number = 0, // Spring starts at page 0
    size: number = 10,
  ): Promise<PaginatedResult<T>> {
    const response = await this.api.get(`/${this.endpoint}/search`, {
      params: { query, page, size },
    });

    const decoded = this.pageProto?.decode(new Uint8Array(response.data));
    return this.mapToPaginatedResult(decoded);
  }

  async findByPage(page: number = 0, size: number = 10): Promise<PaginatedResult<T>> {
    const response = await this.api.get(`/${this.endpoint}/all`, {
      params: { page, size },
    });

    const decoded = this.pageProto?.decode(new Uint8Array(response.data));
    return this.mapToPaginatedResult(decoded);
  }

  async create(item: T): Promise<T> {
    const body = this.proto?.encode(item).finish();
    const response = await this.api.post(`/${this.endpoint}`, body, {
      headers: { 'Content-Type': 'application/x-protobuf' }
    });
    
    return this.proto?.decode(new Uint8Array(response.data)) as T;
  }

  async findAll(): Promise<T[]> {
    const response = await this.api.get(`/${this.endpoint}`);
    // For List<BookProto>, handle as an array of messages or a wrapper message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = this.proto?.decode(new Uint8Array(response.data)) as any;
    return decoded.content || [];
  }

  async findById(id: ID): Promise<T | null> {
    const response = await this.api.get(`/${this.endpoint}/${id}`);
    if (!response.data) return null;
    return this.proto?.decode(new Uint8Array(response.data)) as T;
  }

  async update(id: ID, item: Partial<T>): Promise<T | null> {
    // Controller uses PatchMapping with JSON for partial updates
    const response = await this.api.patch(`/${this.endpoint}/${id}`, item, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    return this.proto?.decode(new Uint8Array(response.data)) as T;
  }

  async delete(id: ID): Promise<boolean> {
    const response = await this.api.delete(`/${this.endpoint}/${id}`);
    return response.status === 204;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected mapToPaginatedResult(protoPage: any): PaginatedResult<T> {
    return {
      content: protoPage.content || [],
      totalElements: protoPage.totalElements,
      totalPages: protoPage.totalPages,
      pageNumber: protoPage.pageNumber,
      pageSize: protoPage.pageSize,
    };
  }
}