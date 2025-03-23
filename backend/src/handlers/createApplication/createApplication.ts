import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Application, User } from "../../db/types";
import { LOAN_TERMS } from "../../constants";
import { insertApplication } from "../../db/queries/applications/insertApplication";
import { getUser } from "../../db/queries/users/getUser";
import { getLatestApplication } from "../../db/queries/applications/getLatestApplication";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
} from "../../errors/ApplicationErrors";
import { handleError } from "../../utils/errorHandler";

interface CreateApplicationRequest {
  userId: string;
  requestedAmount: number;
}

// Input validation functions
const validateRequiredFields = (data: CreateApplicationRequest): void => {
  if (!data.userId || !data.requestedAmount) {
    throw new ValidationError(
      "Missing required fields: userId and requestedAmount are required"
    );
  }
};

const validateAmount = (amount: number): void => {
  if (typeof amount !== "number" || amount <= 0) {
    throw new ValidationError("requestedAmount must be a positive number");
  }
};

// Business logic functions
const generateApplicationId = async (user: User): Promise<string> => {
  const latestApplication = await getLatestApplication(user);
  // If there is no latest application or the latest application is in a closed state, generate a new application ID
  const closedStates = ["cancelled", "rejected", "repaid"];
  if (
    !latestApplication ||
    closedStates.includes(latestApplication.applicationState)
  ) {
    return uuidv4();
  }
  throw new ConflictError(
    "Active application already exists. Only 1 application can exist at a time."
  );
};

const createApplicationService = async (
  data: CreateApplicationRequest
): Promise<Application> => {
  const now = new Date();
  const dueDate = new Date(
    new Date().getTime() +
      LOAN_TERMS.DEFAULT_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  // Check if user exists
  const user = await getUser(data.userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  // Generate application ID
  const applicationId = await generateApplicationId(user);
  if (applicationId === "") {
    throw new ConflictError(
      "Active application already exists. Only 1 application can exist at a time."
    );
  }

  // Create the application
  const application: Application = {
    applicationId,
    userId: data.userId,
    requestedAmount: data.requestedAmount,
    applicationState: "open",
    createdAt: now,
    updatedAt: now,
    dueDate,
  };

  const newApplication = await insertApplication(application);
  if (!newApplication) {
    throw new DatabaseError("Failed to create application");
  }

  return newApplication;
};

// Main handler
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: CreateApplicationRequest = JSON.parse(event.body || "{}");

    // Validate input
    validateRequiredFields(body);
    validateAmount(body.requestedAmount);

    // Process application
    const result = await createApplicationService(body);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return handleError(error);
  }
};
