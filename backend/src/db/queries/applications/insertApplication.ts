import { PoolClient } from "pg";
import { Application } from "../../types";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbApplicationRow } from "../../utils/typeMappers";
/**
 * Creates a new application in the database
 * @param application The application to create
 * @returns The created application
 * @throws {Error} If there's a database connection or query error
 */
export async function insertApplication(
  application: Application,
  client?: PoolClient
): Promise<Application | null> {
  return withDbClient(async (client) => {
    const query = `
      INSERT INTO applications (application_id, user_id, requested_amount, application_state, created_at, updated_at, due_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        application_id as "applicationId",
        user_id as "userId",
        requested_amount as "requestedAmount",
        application_state as "applicationState",
        created_at as "createdAt",
        updated_at as "updatedAt",
        due_date as "dueDate"
    `;

    const result = await client.query(query, [
      application.applicationId,
      application.userId,
      application.requestedAmount,
      application.applicationState,
      application.createdAt,
      application.updatedAt,
      application.dueDate,
    ]);
    return mapDbApplicationRow(result.rows[0]);
  }, client);
}
