import { PoolClient } from "pg";
import { Application } from "../../types";
import {
  mapDbApplicationRow,
  mapDbApplicationRows,
} from "../../utils/typeMappers";
import { withDbClient } from "../../utils/withDbClient";

export async function getApplicationHistory(
  userId: string,
  client?: PoolClient
): Promise<Application[]> {
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
      ORDER BY created_at DESC`,
      [userId]
    );
    return mapDbApplicationRows(result.rows);
  }, client);
}
