import { User } from "../../types";
import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbUserRows } from "../../utils/typeMappers";
export async function selectAllUsers(client?: PoolClient): Promise<User[]> {
  return withDbClient(async (dbClient) => {
    const result = await dbClient.query(
      `SELECT 
        user_id as "userId",
        credit_limit as "creditLimit",
        user_role as "userRole",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users`
    );
    return mapDbUserRows(result.rows);
  }, client);
}
