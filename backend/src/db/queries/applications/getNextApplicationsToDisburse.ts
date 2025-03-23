import { PoolClient } from "pg";
import { Application } from "../../types";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbApplicationRows } from "../../utils/typeMappers";
export const getNextApplicationsToDisburse = async (
  count: number,
  client?: PoolClient
): Promise<Application[]> => {
  return withDbClient(async (client) => {
    const query = `
      SELECT
        a.application_id as "applicationId",
        a.user_id as "userId",
        a.application_state as "applicationState",
        a.requested_amount as "requestedAmount",
        a.due_date as "dueDate",
        a.created_at as "createdAt",
        a.updated_at as "updatedAt"
      FROM applications a
	    LEFT JOIN disbursements d
	    ON a.application_id = d.application_id
      WHERE a.application_state = 'outstanding' and d.disbursement_state <> 'disbursed'
      ORDER BY a.due_date
      LIMIT $1
  `;
    const result = await client.query(query, [count]);
    return mapDbApplicationRows(result.rows);
  }, client);
};
