import { APIGatewayProxyHandler } from "aws-lambda";
import { Application } from "../../db/types";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "../../errors/ApplicationErrors";
import { handleError } from "../../utils/errorHandler";
import { withTransaction } from "../../db/utils/withTransaction";
import { updateApplicationState } from "../../db/queries/applications/updateApplicationState";
import { getApplication } from "../../db/queries/applications/getApplication";

interface CancelApplicationRequest {
  applicationId: string;
}

const cancelApplicationService = async (
  data: CancelApplicationRequest
): Promise<Application | null> => {
  return withTransaction(async (client) => {
    // Check if application exists
    const application = await getApplication(data.applicationId, client);
    if (!application) {
      throw new NotFoundError("Application");
    }

    // Validate current state
    if (application.applicationState !== "open") {
      throw new ValidationError(
        `Cannot cancel application in ${application.applicationState} state`
      );
    }

    // Update application state to cancelled
    const result = await updateApplicationState(
      application.applicationId,
      "cancelled",
      client
    );

    if (!result) {
      throw new DatabaseError("Application was unable to be cancelled");
    }

    return result;
  });
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: CancelApplicationRequest = JSON.parse(event.body || "{}");

    if (!body.applicationId) {
      throw new ValidationError("Missing required field: applicationId");
    }

    const result = await cancelApplicationService(body);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    return handleError(error);
  }
};
