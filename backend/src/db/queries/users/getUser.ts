import { User } from "../../types";
import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbUserRow } from "../../utils/typeMappers";
export async function getUser(
  userId: string,
  client?: PoolClient
): Promise<User | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `SELECT 
        user_id as "userId",
        credit_limit as "creditLimit",
        user_role as "userRole",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users 
      WHERE user_id = $1`,
      [userId]
    );
    return mapDbUserRow(result.rows[0]);
  }, client);
}
