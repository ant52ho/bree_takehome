import { Application, User } from "../../types";
import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbApplicationRow } from "../../utils/typeMappers";

/**
 * Retrieves the most recent application for a given user
 * @param user The user to get the latest application for
 * @param client Optional database client for transaction support
 * @returns The most recent application or null if none exists
 * @throws {Error} If there's a database connection or query error
 */
export async function getLatestApplication(
  user: User,
  client?: PoolClient
): Promise<Application | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `SELECT 
        application_id as "applicationId",
        user_id as "userId",
        application_state as "applicationState",
        requested_amount as "requestedAmount",
        due_date as "dueDate",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM applications 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1`,
      [user.userId]
    );

    return mapDbApplicationRow(result.rows[0]);
  }, client);
}
