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
  /**
   * Recalculates and updates history status for a single specific user.
   * Backend returns the updated UserProto.
   */
  async updateStatusForUser(userId: number): Promise<User | null> {
    try {
      // Calls POST /api/users/sync-history-status/{id}
      const response = await this.api.post(`/${this.endpoint}/sync-history-status/${userId}`);

      if (!response.data || response.data.byteLength === 0) return null;

      // Decode the Protobuf response
      const uint8Array = new Uint8Array(response.data);
      return (this.proto.decode(uint8Array) as unknown) as User;
      
    } catch (error) {
      console.error(`Failed to refresh status for user ${userId}:`, error);
      throw error;
    }
  }
  /**
   * Triggers the backend logic to recalculate historyStatus 
   * (New, Good, Boomer) for all users based on order history.
   */
  async updateStatusForAllUser(): Promise<Map<string, string> | null> {
    try {
      // Use POST to the specific sync endpoint
      const response = await this.api.post(`/${this.endpoint}/sync-history-status`, null, {
        headers: {
          // Explicitly ask for JSON because this is a maintenance response, not an entity
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Override the global arraybuffer responseType for this JSON call
        responseType: 'json' 
      });

      if (response.status === 200) {
        // Returns the Map/Object from the backend: { "message": "Successfully..." }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to sync user history statuses:", error);
      throw error;
    }
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