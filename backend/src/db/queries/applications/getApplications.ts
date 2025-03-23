import { PoolClient } from "pg";
import { Application } from "../../types";
import { mapDbApplicationRows } from "../../utils/typeMappers";
export const getApplications = async (
  client: PoolClient
): Promise<Application[]> => {
  const result = await client.query(
    `SELECT 
      application_id as "applicationId",
      user_id as "userId",
      requested_amount as "requestedAmount",
      application_state as "applicationState",
      due_date as "dueDate",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM applications
    ORDER BY created_at DESC`
  );

  return mapDbApplicationRows(result.rows);
};
