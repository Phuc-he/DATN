import { Author } from "@/src/domain/entity/author.entity";
import { AuthorRepository } from "@/src/domain/repository/author.repository";
import { AuthorPageResponse, AuthorProto, AuthorProtoList } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class AuthorRepositoryImpl extends BaseRepositoryImpl<Author> implements AuthorRepository {
  protected listProto = AuthorProtoList;
  protected proto = AuthorProto;

  protected pageProto = AuthorPageResponse;

  constructor() {
    super('api/authors');
  }
}