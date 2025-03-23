import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbNumeric } from "../../utils/typeMappers";

/**
 * Retrieves the outstanding balance for a given application
 * Only considers confirmed disbursements found in transactions table.
 * Doesn't consider amounts on requested application
 * @param applicationId The ID of the application
 * @param client The database client to use (optional)
 * @returns The outstanding balance
 */
export async function getOutstandingBalance(
  applicationId: string,
  client?: PoolClient
): Promise<number | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `
      SELECT COALESCE(SUM(
        CASE 
          WHEN transaction_type = 'disbursement' THEN amount
          WHEN transaction_type = 'repayment' THEN -amount
          ELSE 0
        END
      ), 0) as balance
      FROM transactions
      WHERE application_id = $1
      `,
      [applicationId]
    );

    return mapDbNumeric(result.rows[0].balance);
  }, client);
}
