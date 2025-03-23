import { Application } from "../../types";
import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbApplicationRow } from "../../utils/typeMappers";
export async function updateApplicationState(
  applicationId: string,
  newState: Application["applicationState"],
  client?: PoolClient
): Promise<Application | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `UPDATE applications 
       SET application_state = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE application_id = $1
       RETURNING 
         application_id as "applicationId",
         user_id as "userId",
         application_state as "applicationState",
         requested_amount as "requestedAmount",
         due_date as "dueDate",
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [applicationId, newState]
    );
    return mapDbApplicationRow(result.rows[0]);
  }, client);
}
