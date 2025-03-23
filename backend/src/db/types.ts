export interface User {
  userId: string;
  creditLimit: number;
  userRole: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSummary {
  userId: string;
  creditLimit: number;
  role: "customer" | "admin";
}

export interface Application {
  applicationId: string;
  userId: string;
  applicationState:
    | "open"
    | "cancelled"
    | "rejected"
    | "outstanding"
    | "repaid";
  requestedAmount: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  transactionId: string;
  applicationId: string;
  transactionType: "disbursement" | "repayment" | "fee" | "tip";
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disbursement {
  disbursementId: string;
  applicationId: string;
  amount: number;
  disbursementState: "pending" | "disbursed" | "cancelled";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbError {
  message: string;
  code?: string;
  detail?: string;
}
