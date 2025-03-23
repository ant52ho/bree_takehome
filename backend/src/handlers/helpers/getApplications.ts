import { APIGatewayProxyHandler } from "aws-lambda";
import { Application } from "../../db/types";
import { DatabaseError } from "../../errors/ApplicationErrors";
import { handleError } from "../../utils/errorHandler";
import { withTransaction } from "../../db/utils/withTransaction";
import { getApplications } from "../../db/queries/applications/getApplications";
const getApplicationsService = async (): Promise<Application[]> => {
  return withTransaction(async (client) => {
    const applications = await getApplications(client);
    if (!applications) {
      throw new DatabaseError("Failed to fetch applications");
    }
    return applications;
  });
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const applications = await getApplicationsService();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(applications),
    };
  } catch (error) {
    return handleError(error);
  }
};
