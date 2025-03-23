import { PoolClient } from "pg";
import { Transaction } from "../../types";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbTransactionRow } from "../../utils/typeMappers";
/**
 * Creates a new transaction in the database
 * @param transaction The transaction to create
 * @returns The created transaction
 * @throws {Error} If there's a database connection or query error
 */
export async function insertTransaction(
  transaction: Transaction,
  client?: PoolClient
): Promise<Transaction | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `INSERT INTO transactions (
        transaction_id,
        application_id,
        transaction_type,
        amount,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        transaction_id as "transactionId",
        application_id as "applicationId",
        transaction_type as "transactionType",
        amount as "amount",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [
        transaction.transactionId,
        transaction.applicationId,
        transaction.transactionType,
        transaction.amount,
        transaction.createdAt,
        transaction.updatedAt,
      ]
    );

    return mapDbTransactionRow(result.rows[0]);
  }, client);
}
