import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { User } from '@/src/domain/entity/user.entity';
import { UserRepository } from '@/src/domain/repository/user.repository';
import { Constants } from '@/src/shared/constans';


export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: User): Promise<User> {
    return this.userRepository.create(user);
  }
}


export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}


export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }
}


export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: number,
    data: Partial<User>,
  ): Promise<User | null> {
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}


export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error(`User with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

export class GetUsersByPageUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.findByPage(page, limit);
  }
}

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return user;
  }
}

export class SearchUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.search(query, page, limit);
  }
}