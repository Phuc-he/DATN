export interface Author {
  id?: number;            // Long in Kotlin maps to number in TS
  name: string;
  bio?: string;           // String? maps to optional string
  profileImage?: string;  // String? maps to optional string
}

/**
 * Optional: A default/empty author object for form initialization
 */
export const EmptyAuthor: Author = {
  name: '',
  bio: '',
  profileImage: ''
};