import { User } from "@/src/domain/entity/user.entity";
import { UserRepository } from "@/src/domain/repository/user.repository";
import { UserPageResponse, UserProto, UserProtoList } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class UserRepositoryImpl extends BaseRepositoryImpl<User> implements UserRepository {
  protected listProto = UserProtoList;
  protected proto = UserProto;

  protected pageProto = UserPageResponse;

  constructor() {
    super('api/users');
  }
  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await this.api.get(`/${this.endpoint}/email/${email}`);

      if (!response.data || response.data.byteLength === 0) return null;

      // This ensures we are working with a clean Uint8Array
      // regardless of whether Axios returned a Buffer or ArrayBuffer
      const uint8Array = new Uint8Array(
        response.data.buffer || response.data,
        response.data.byteOffset || 0,
        response.data.byteLength || response.data.length
      );

      // If this still fails at .decode, the schema.ts is definitely 
      // out of sync with the backend UserProto.java
      // Replace: return this.proto?.decode(uint8Array) as User;
      return (this.proto.decode(uint8Array) as unknown) as User;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }
}