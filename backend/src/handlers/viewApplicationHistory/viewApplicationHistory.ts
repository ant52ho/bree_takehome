import { getApplicationHistory } from "../../db/queries/applications/getApplicationHistory";
import { Application } from "../../db/types";
import { getUser } from "../../db/queries/users/getUser";
import { NotFoundError, ValidationError } from "../../errors/ApplicationErrors";
import { APIGatewayProxyHandler } from "aws-lambda";
import { handleError } from "../../utils/errorHandler";

interface ViewApplicationHistoryRequest {
  userId: string;
}

const viewApplicationHistoryService = async (
  data: ViewApplicationHistoryRequest
): Promise<Application[]> => {
  const user = await getUser(data.userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  return await getApplicationHistory(data.userId);
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      throw new ValidationError("Missing required query parameter: userId");
    }

    const result = await viewApplicationHistoryService({ userId });

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
