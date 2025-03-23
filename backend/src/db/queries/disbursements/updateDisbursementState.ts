import { PoolClient } from "pg";
import { Disbursement } from "../../types";
import { mapDbDisbursementRow } from "../../utils/typeMappers";
import { withDbClient } from "../../utils/withDbClient";

export const updateDisbursementState = async (
  applicationId: string,
  state: Disbursement["disbursementState"],
  client: PoolClient
): Promise<Disbursement | null> => {
  return withDbClient(async (client) => {
    const result = await client.query(
      `UPDATE disbursements
    SET disbursement_state = $1,
        updated_at = NOW()
    WHERE application_id = $2
    RETURNING 
      disbursement_id as "disbursementId",
      application_id as "applicationId",
      amount,
      disbursement_state as "disbursementState",
      due_date as "dueDate",
      created_at as "createdAt",
      updated_at as "updatedAt"`,
      [state, applicationId]
    );

    return mapDbDisbursementRow(result.rows[0]) || null;
  }, client);
};
