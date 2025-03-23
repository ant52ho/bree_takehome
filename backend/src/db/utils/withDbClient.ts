import { DbClient } from "../dbClient";
import { DatabaseError } from "../../errors/ApplicationErrors";
import { PoolClient } from "pg";

type DbOperation<T> = (client: PoolClient) => Promise<T>;

/**
 * Executes a database operation with proper connection management.
 * If a client is provided, it will be used (for transaction support).
 * If no client is provided, a new connection will be created and managed.
 */
export async function withDbClient<T>(
  operation: DbOperation<T>,
  existingClient?: PoolClient
): Promise<T> {
  const shouldManageConnection = !existingClient;
  const client = existingClient || (await DbClient.connect());

  try {
    return await operation(client);
  } catch (error) {
    throw new DatabaseError(
      `Database operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    if (shouldManageConnection) {
      await client.release();
    }
  }
}
