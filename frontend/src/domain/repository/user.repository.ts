import { User } from "../entity/user.entity";
import { BaseRepository } from "./base.repository";

export abstract class UserRepository extends BaseRepository<User, number> {
    abstract findByEmail(email: string): Promise<User | null>;
    abstract updateStatusForAllUser(): Promise<Map<string, string> | null>;
    abstract updateStatusForUser(userId: number): Promise<User | null>;
}
