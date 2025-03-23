import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Application, Transaction } from "../../db/types";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "../../errors/ApplicationErrors";
import { handleError } from "../../utils/errorHandler";
import { withTransaction } from "../../db/utils/withTransaction";
import { getApplication } from "../../db/queries/applications/getApplication";
import { getOutstandingBalance } from "../../db/queries/transactions/getOutstandingBalance";
import { insertTransaction } from "../../db/queries/transactions/insertTransaction";
import { updateApplicationState } from "../../db/queries/applications/updateApplicationState";
import { getDisbursement } from "../../db/queries/disbursements/getDisbursement";
interface RepayApplicationRequest {
  applicationId: string;
  amount: number;
}

const validateAmount = (amount: number): void => {
  if (typeof amount !== "number" || amount <= 0) {
    throw new ValidationError("Amount must be a positive number");
  }
};

const repayApplicationService = async (
  data: RepayApplicationRequest
): Promise<{ application: Application; newBalance: number }> => {
  return withTransaction(async (client) => {
    // Validate amount
    validateAmount(data.amount);

    // Get latest application
    const application = await getApplication(data.applicationId, client);
    if (!application) {
      throw new NotFoundError("Application");
    }

    // Validate current state
    if (application.applicationState !== "outstanding") {
      throw new ValidationError(
        `Cannot repay application in ${application.applicationState} state`
      );
    }

    // if corresponding disbursement is not in disbursed state, then error
    const disbursement = await getDisbursement(
      application.applicationId,
      client
    );
    if (!disbursement || disbursement.disbursementState !== "disbursed") {
      throw new ValidationError(
        "Disbursement has not been sent out, cannot repay yet"
      );
    }

    // Get current balance
    const currentBalance = await getOutstandingBalance(
      application.applicationId,
      client
    );
    if (currentBalance === null) {
      throw new NotFoundError("Outstanding balance");
    }

    // Validate exact repayment amount
    if (data.amount > currentBalance) {
      throw new ValidationError(
        `Repayment amount ${data.amount} exceeds outstanding balance ${currentBalance}`
      );
    }

    // Create repayment transaction
    const transaction: Transaction = {
      transactionId: uuidv4(),
      applicationId: application.applicationId,
      transactionType: "repayment",
      amount: data.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const insertTransactionResult = await insertTransaction(
      transaction,
      client
    );
    if (!insertTransactionResult) {
      throw new DatabaseError("Transaction was unable to be inserted");
    }

    // Check if fully repaid
    const newBalance = currentBalance - data.amount;
    if (newBalance === 0) {
      // Update application state to repaid
      const updatedApplication: Application = {
        ...application,
        applicationState: "repaid",
        updatedAt: new Date(),
      };

      const updatedResult = await updateApplicationState(
        updatedApplication.applicationId,
        "repaid",
        client
      );
      if (!updatedResult) {
        throw new DatabaseError("Application was unable to be updated");
      }
      return { application: updatedApplication, newBalance };
    } else {
      return { application, newBalance };
    }
  });
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: RepayApplicationRequest = JSON.parse(event.body || "{}");

    if (!body.applicationId || !body.amount) {
      throw new ValidationError(
        "Missing required fields: applicationId and amount"
      );
    }

    const result = await repayApplicationService(body);
    console.log(result);

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
