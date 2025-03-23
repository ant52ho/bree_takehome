import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../../db/types";
import { DatabaseError, ValidationError } from "../../errors/ApplicationErrors";
import { insertTransaction } from "../../db/queries/transactions/insertTransaction";
import { handleError } from "../../utils/errorHandler";
import { getApplication } from "../../db/queries/applications/getApplication";
interface CreateTransactionRequest {
  applicationId: string;
  transactionType: "disbursement" | "repayment" | "fee";
  amount: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: CreateTransactionRequest = JSON.parse(event.body || "{}");

    // Validate amount
    if (typeof body.amount !== "number" || body.amount <= 0) {
      throw new ValidationError("Amount must be a positive number");
    }

    // Validate transaction type
    if (!["disbursement", "repayment", "fee"].includes(body.transactionType)) {
      throw new ValidationError(
        'Transaction type must be either "disbursement", "repayment", or "fee"'
      );
    }

    // Validate application exists
    const application = await getApplication(body.applicationId);
    if (!application) {
      throw new ValidationError("Application does not exist");
    }

    // Create transaction object with generated fields
    const now = new Date();
    const transaction: Transaction = {
      transactionId: uuidv4(),
      applicationId: body.applicationId,
      transactionType: body.transactionType,
      amount: body.amount,
      createdAt: now,
      updatedAt: now,
    };

    // Insert into database
    const createdTransaction = await insertTransaction(transaction);

    if (!createdTransaction) {
      throw new DatabaseError("Failed to create transaction");
    }

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(createdTransaction),
    };
  } catch (error) {
    return handleError(error);
  }
};
