import { Category } from "@/src/domain/entity/category.entity";
import { CategoryRepository } from "@/src/domain/repository/category.repository";
import { CategoryPageResponse, CategoryProto } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class CategoryRepositoryImpl extends BaseRepositoryImpl<Category> implements CategoryRepository {
  protected proto = CategoryProto;

  protected pageProto = CategoryPageResponse;

  constructor() {
    super('api/categories');
  }
}