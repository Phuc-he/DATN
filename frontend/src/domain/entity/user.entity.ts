import { Role } from './role.enum';

/**
 * Represents the User domain model.
 * Matches org.datn.backend.domain.entity.User
 */
export interface User {
  id?: number;
  username: string;
  email: string;
  
  /** * @internal Note: Password should usually be omitted 
   * in the frontend unless used for the Login/Register forms.
   */
  password?: string;
  
  role: Role;
  fullName?: string;
  address?: string;
  phone?: string;
  avatar?: string;

  // Timestamps are typically sent as ISO strings via Protobuf/JSON
  createdAt?: string; 
  updatedAt?: string;
}

/**
 * Helper to check if a profile is complete
 */
export const isProfileComplete = (user: User): boolean => {
  return !!(user.fullName && user.address && user.phone);
};