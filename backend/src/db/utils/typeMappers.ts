import { Application, User, Transaction, Disbursement } from "../types";

// Internal single row mapper implementations
function mapSingleApplicationRow(row: any): Application | null {
  if (!row) return null;

  return {
    applicationId: row.applicationId,
    userId: row.userId,
    applicationState: row.applicationState,
    requestedAmount: Number(row.requestedAmount),
    dueDate: new Date(row.dueDate),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function mapSingleUserRow(row: any): User | null {
  if (!row) return null;

  return {
    userId: row.userId,
    creditLimit: Number(row.creditLimit),
    userRole: row.userRole,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function mapSingleTransactionRow(row: any): Transaction | null {
  if (!row) return null;

  return {
    transactionId: row.transactionId,
    applicationId: row.applicationId,
    transactionType: row.transactionType,
    amount: Number(row.amount),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function mapSingleDisbursementRow(row: any): Disbursement | null {
  if (!row) return null;

  return {
    disbursementId: row.disbursementId,
    applicationId: row.applicationId,
    amount: Number(row.amount),
    disbursementState: row.disbursementState,
    dueDate: new Date(row.dueDate),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export function mapDbNumeric(value: any): number | null {
  if (!value) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  return num;
}

// Single row mappers - return null when row doesn't exist
export function mapDbApplicationRow(row: any): Application | null {
  return mapSingleApplicationRow(row);
}

export function mapDbUserRow(row: any): User | null {
  return mapSingleUserRow(row);
}

export function mapDbTransactionRow(row: any): Transaction | null {
  return mapSingleTransactionRow(row);
}

export function mapDbDisbursementRow(row: any): Disbursement | null {
  return mapSingleDisbursementRow(row);
}

// Multiple row mappers - always return an array (empty if no results)
export function mapDbApplicationRows(rows: any[]): Application[] {
  return rows
    .map(mapSingleApplicationRow)
    .filter((row): row is Application => row !== null);
}

export function mapDbUserRows(rows: any[]): User[] {
  return rows.map(mapSingleUserRow).filter((row): row is User => row !== null);
}

export function mapDbTransactionRows(rows: any[]): Transaction[] {
  return rows
    .map(mapSingleTransactionRow)
    .filter((row): row is Transaction => row !== null);
}

export function mapDbDisbursementRows(rows: any[]): Disbursement[] {
  return rows
    .map(mapSingleDisbursementRow)
    .filter((row): row is Disbursement => row !== null);
}
