import { Pool, PoolClient } from "pg";
import { Disbursement } from "../../types";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbDisbursementRow } from "../../utils/typeMappers";

export const getDisbursement = async (
  applicationId: string,
  client?: PoolClient
): Promise<Disbursement | null> => {
  return withDbClient(async (client) => {
    const result = await client.query(
      `SELECT 
            disbursement_id as "disbursementId",
            application_id as "applicationId",
            amount as "amount",
            disbursement_state as "disbursementState",
            due_date as "dueDate",
            created_at as "createdAt",
            updated_at as "updatedAt"
        FROM disbursements 
        WHERE application_id = $1`,
      [applicationId]
    );

    return mapDbDisbursementRow(result.rows[0]);
  }, client);
};
