import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
/**
 * Creates a new disbursement in the database
 * @param disbursement The disbursement to create
 * @returns The created disbursement
 * @throws {Error} If there's a database connection or query error
 */
export async function getOutstandingBalance(
  applicationId: string,
  client?: PoolClient
): Promise<number> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `SELECT 
      COALESCE(
        requested_amount - (
          SELECT COALESCE(SUM(amount), 0)
          FROM transactions
          WHERE application_id = applications.application_id
          AND transaction_type = 'repayment'
        ),
        0
      ) as balance
    FROM applications
    WHERE application_id = $1`,
      [applicationId]
    );

    return result.rows[0].balance;
  }, client);
}
