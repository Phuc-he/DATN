import { Author } from "../entity/author.entity";
import { BaseRepository } from "./base.repository";

export abstract class AuthorRepository extends BaseRepository<Author, number> { }
