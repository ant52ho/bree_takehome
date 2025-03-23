import { Application } from "../../types";
import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbApplicationRow } from "../../utils/typeMappers";

export async function getApplication(
  applicationId: string,
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
      WHERE application_id = $1`,
      [applicationId]
    );

    // Since we're querying by primary key, we expect at most one row
    return mapDbApplicationRow(result.rows[0]);
  }, client);
}
