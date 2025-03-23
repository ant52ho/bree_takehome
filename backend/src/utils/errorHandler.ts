import { APIGatewayProxyResult } from "aws-lambda";
import { BaseError } from "../errors/ApplicationErrors";

export const handleError = (error: unknown): APIGatewayProxyResult => {
  console.error(error);

  // Check if error has the shape of our BaseError
  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    "code" in error &&
    "message" in error
  ) {
    return {
      statusCode: (error as BaseError).statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: error.message,
        code: error.code,
      }),
    };
  }

  // Handle unexpected errors
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Internal Server Error",
      code: "INTERNAL_ERROR",
    }),
  };
};
