import { PoolClient } from "pg";
import { Disbursement } from "../../types";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbDisbursementRow } from "../../utils/typeMappers";
/**
 * Creates a new disbursement in the database
 * @param disbursement The disbursement to create
 * @returns The created disbursement
 * @throws {Error} If there's a database connection or query error
 */
export async function insertDisbursement(
  disbursement: Disbursement,
  client?: PoolClient
): Promise<Disbursement | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `INSERT INTO disbursements (
        disbursement_id,
        application_id,
        amount,
        disbursement_state,
        due_date,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        disbursement_id as "disbursementId",
        application_id as "applicationId",
        amount as "amount",
        disbursement_state as "disbursementState",
        due_date as "dueDate",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [
        disbursement.disbursementId,
        disbursement.applicationId,
        disbursement.amount,
        disbursement.disbursementState,
        disbursement.dueDate,
        disbursement.createdAt,
        disbursement.updatedAt,
      ]
    );

    return mapDbDisbursementRow(result.rows[0]);
  }, client);
}
