import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../db/types";
import { DatabaseError, ValidationError } from "../../errors/ApplicationErrors";
import { insertUser } from "../../db/queries/users/insertUser";
import { handleError } from "../../utils/errorHandler";

interface CreateUserRequest {
  creditLimit: number;
  userRole: "customer" | "admin";
  userId?: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: CreateUserRequest = JSON.parse(event.body || "{}");

    // Validate credit limit
    if (typeof body.creditLimit !== "number" || body.creditLimit <= 0) {
      throw new ValidationError("Credit limit must be a positive number");
    }

    // Validate user role
    if (!body.userRole) {
      body.userRole = "customer";
    }
    if (!["customer", "admin"].includes(body.userRole)) {
      throw new ValidationError(
        'User role must be either "customer" or "admin"'
      );
    }

    // Create user object with generated fields
    const now = new Date();
    const user: User = {
      userId: body.userId || uuidv4(),
      creditLimit: body.creditLimit,
      userRole: body.userRole,
      createdAt: now,
      updatedAt: now,
    };

    // Insert into database
    const createdUser = await insertUser(user);

    if (!createdUser) {
      throw new DatabaseError("Failed to create user");
    }

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(createdUser),
    };
  } catch (error) {
    return handleError(error);
  }
};
