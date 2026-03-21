/**
 * Matches org.datn.backend.domain.entity.Role
 * Defines the access levels for Users within the system.
 */
export enum Role {
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
  CUSTOMER = 'CUSTOMER'
}

/**
 * Utility to check if a user has permission for sensitive actions
 */
export const isAdmin = (role: Role | string): boolean => role === Role.ADMIN;
export const isAuthor = (role: Role | string): boolean => role === Role.AUTHOR;

/**
 * Friendly labels for the Admin Management UI
 */
export const RoleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Quản trị viên',
  [Role.AUTHOR]: 'Tác giả',
  [Role.CUSTOMER]: 'Khách hàng'
};