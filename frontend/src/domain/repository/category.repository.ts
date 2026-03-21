import { Category } from "../entity/category.entity";
import { BaseRepository } from "./base.repository";

export abstract class CategoryRepository extends BaseRepository<Category, number> { }
