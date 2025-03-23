import { User } from "../../types";
import { PoolClient } from "pg";
import { withDbClient } from "../../utils/withDbClient";
import { mapDbUserRow } from "../../utils/typeMappers";
/**
 * Inserts a new user in the database
 * @param user The user to insert
 * @param client The database client to use (optional)
 * @returns The created user
 * @throws {Error} If there's an error inserting the user
 */
export async function insertUser(
  user: User,
  client?: PoolClient
): Promise<User | null> {
  return withDbClient(async (client) => {
    const result = await client.query(
      `INSERT INTO users (
        user_id,
        credit_limit,
        user_role,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        user_id as "userId",
        credit_limit as "creditLimit",
        user_role as "userRole",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [
        user.userId,
        user.creditLimit,
        user.userRole,
        user.createdAt,
        user.updatedAt,
      ]
    );

    return mapDbUserRow(result.rows[0]);
  }, client);
}
