import { DbClient } from "../dbClient";
import { DatabaseError } from "../../errors/ApplicationErrors";
import { PoolClient } from "pg";

type TransactionOperation<T> = (client: PoolClient) => Promise<T>;

/**
 * Executes a database operation within a transaction.
 * Handles BEGIN, COMMIT, ROLLBACK, and connection management.
 */
export async function withTransaction<T>(
  operation: TransactionOperation<T>
): Promise<T> {
  const client = await DbClient.connect();

  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error instanceof Error
      ? error
      : new DatabaseError("Transaction failed");
  } finally {
    await client.release();
  }
}
