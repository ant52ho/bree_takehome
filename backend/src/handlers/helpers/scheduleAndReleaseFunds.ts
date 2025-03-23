import { APIGatewayProxyHandler } from "aws-lambda";
import { withTransaction } from "../../db/utils/withTransaction";
import { DatabaseError, ValidationError } from "../../errors/ApplicationErrors";
import { handleError } from "../../utils/errorHandler";
import { getNextApplicationsToDisburse } from "../../db/queries/applications/getNextApplicationsToDisburse";
import { Transaction } from "../../db/types";
import { v4 as uuidv4 } from "uuid";
import { insertTransaction } from "../../db/queries/transactions/insertTransaction";
import { updateDisbursementState } from "../../db/queries/disbursements/updateDisbursementState";
import { requireRole } from "../../utils/auth";
interface ReleaseFundsRequest {
  count: number;
}

interface ReleaseFundsResponse {
  processedCount: number;
  processedApplicationIds: string[];
  message: string;
}

const processScheduledDisbursements = async (
  data: ReleaseFundsRequest
): Promise<ReleaseFundsResponse> => {
  return withTransaction(async (client) => {
    // Get all scheduled disbursements
    const nextApplicationsToDisburse = await getNextApplicationsToDisburse(
      data.count,
      client
    );
    if (!nextApplicationsToDisburse) {
      throw new DatabaseError("Failed to fetch scheduled disbursements");
    }

    // Process each scheduled disbursement
    for (const nextApp of nextApplicationsToDisburse) {
      // Update disbursement state to completed
      const updatedDisbursement = await updateDisbursementState(
        nextApp.applicationId,
        "disbursed",
        client
      );

      if (!updatedDisbursement) {
        throw new DatabaseError(
          `Failed to update disbursement ${nextApp.applicationId}`
        );
      }

      // create transaction record for disbursement
      const transaction: Transaction = {
        transactionId: uuidv4(),
        applicationId: nextApp.applicationId,
        transactionType: "disbursement",
        amount: nextApp.requestedAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transactionResult = await insertTransaction(transaction, client);

      if (!transactionResult) {
        throw new DatabaseError("Failed to create transaction record");
      }
    }

    return {
      processedCount: nextApplicationsToDisburse.length,
      processedApplicationIds: nextApplicationsToDisburse.map(
        (app) => app.applicationId
      ),
      message: `Successfully processed ${
        nextApplicationsToDisburse.length
      } disbursement${nextApplicationsToDisburse.length === 1 ? "" : "s"}`,
    };
  });
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    requireRole(event, ["admin"]);
    const body: ReleaseFundsRequest = JSON.parse(event.body || "{}");

    if (!body.count) {
      throw new ValidationError("Missing required field: count");
    }

    const result = await processScheduledDisbursements(body);

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
