// src/handlers/getDataHandler.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { selectAllUsers } from "../../db/queries/getUserSummary/selectAllUsers"; // Import DB client to query Postgres
import { User } from "../../db/types";
import { handleError } from "../../utils/errorHandler";
import { DatabaseError } from "../../errors/ApplicationErrors";
/**
 * Retrieves a summary of all users from the database
 * @param event The API Gateway event object
 * @returns A JSON response with the user summary data
 * @throws {Error} If there's an error querying the database
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Query data from the Postgres database
    const result: User[] = await selectAllUsers();
    if (!result) {
      throw new DatabaseError("Failed to get users");
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return handleError(error);
  }
};
