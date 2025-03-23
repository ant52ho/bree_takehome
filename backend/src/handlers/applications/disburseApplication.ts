import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Application, Disbursement, Transaction, User } from "../../db/types";
import { getUser } from "../../db/queries/users/getUser";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "../../errors/ApplicationErrors";
import { handleError } from "../../utils/errorHandler";
import { getApplication } from "../../db/queries/applications/getApplication";
import { updateApplicationState } from "../../db/queries/applications/updateApplicationState";
import { withTransaction } from "../../db/utils/withTransaction";
import { insertDisbursement } from "../../db/queries/disbursements/insertDisbursement";
import { insertTransaction } from "../../db/queries/transactions/insertTransaction";
import { FEES, LOAN_TERMS } from "../../constants";
import { updateApplicationDueDate } from "../../db/queries/applications/updateApplicationDueDate";

interface DisburseApplicationRequest {
  applicationId: string;
  expressDelivery?: boolean;
  tip?: number;
}

// Validate credit limit.
// If multiple applications are allowed in the future, this will need to be updated with a sum of all outstanding applications
const validateCreditLimit = async (
  user: User,
  application: Application
): Promise<void> => {
  if (application.requestedAmount > user.creditLimit) {
    throw new ValidationError(
      `Requested amount ${application.requestedAmount} exceeds credit limit ${user.creditLimit}`
    );
  }
};

const disburseApplicationService = async (
  data: DisburseApplicationRequest
): Promise<Disbursement> => {
  return withTransaction(async (client) => {
    // Check if application exists
    const application = await getApplication(data.applicationId, client);
    if (!application) {
      throw new NotFoundError("Application");
    }

    // Validate current state
    if (application.applicationState !== "open") {
      throw new ValidationError(
        `Cannot disburse application in ${application.applicationState} state`
      );
    }

    // Check if user exists
    const user = await getUser(application.userId, client);
    if (!user) {
      throw new NotFoundError("User");
    }

    // Validate credit limit - throw error if credit limit is exceeded
    await validateCreditLimit(user, application);

    // Update application state
    const updatedApplication = await updateApplicationState(
      application.applicationId,
      "outstanding",
      client
    );

    if (!updatedApplication) {
      throw new NotFoundError("Application");
    }

    // if express delivery is true, update application due date and add transaction record
    var dueDate = application.dueDate;
    if (data.expressDelivery) {
      const expressDueDate = new Date(
        new Date().getTime() +
          LOAN_TERMS.EXPRESS_DURATION_DAYS * 24 * 60 * 60 * 1000
      );
      dueDate = expressDueDate;
      if (application.dueDate < expressDueDate) {
        throw new ValidationError(
          "Cannot set express due date to a date after the current due date"
        );
      }

      // Update application with new due date
      const updatedApplicationWithExpress = await updateApplicationDueDate(
        application.applicationId,
        expressDueDate,
        client
      );

      if (!updatedApplicationWithExpress) {
        throw new DatabaseError(
          "Failed to update application for express delivery"
        );
      }

      // Create transaction record for express delivery fee
      const expressTransaction: Transaction = {
        transactionId: uuidv4(),
        applicationId: application.applicationId,
        transactionType: "fee",
        amount: FEES.EXPRESS_DELIVERY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expressTransactionResult = await insertTransaction(
        expressTransaction,
        client
      );

      if (!expressTransactionResult) {
        throw new DatabaseError(
          "Failed to create express delivery transaction"
        );
      }
    }

    // if tip is provided, create transaction record
    if (data.tip) {
      const tipTransaction: Transaction = {
        transactionId: uuidv4(),
        applicationId: application.applicationId,
        transactionType: "tip",
        amount: data.tip,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const tipTransactionResult = await insertTransaction(
        tipTransaction,
        client
      );
      if (!tipTransactionResult) {
        throw new DatabaseError("Failed to create tip transaction");
      }
    }

    // Create disbursement record
    const disbursement: Disbursement = {
      disbursementId: uuidv4(),
      applicationId: application.applicationId,
      amount: application.requestedAmount,
      disbursementState: "pending",
      dueDate: dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newDisbursement = await insertDisbursement(disbursement, client);

    if (!newDisbursement) {
      throw new DatabaseError("Failed to create disbursement");
    }

    return newDisbursement;
  });
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: DisburseApplicationRequest = JSON.parse(event.body || "{}");

    if (!body.applicationId) {
      throw new ValidationError("Missing required field: applicationId");
    }

    const result = await disburseApplicationService(body);

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
