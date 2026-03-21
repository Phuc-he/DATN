import { User } from "../entity/user.entity";
import { BaseRepository } from "./base.repository";

export abstract class UserRepository extends BaseRepository<User, number> {
    abstract findByEmail(email: string): Promise<User | null>;
}
