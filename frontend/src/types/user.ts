export type UserRole = "customer" | "admin";

export interface User {
  userId: string;
  creditLimit: number;
  userRole: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  userId?: string;
  creditLimit: number;
  userRole: UserRole;
}

export interface UserSummary {
  userId: string;
  creditLimit: number;
  role: UserRole;
}
