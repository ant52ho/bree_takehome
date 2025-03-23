import { APIGatewayProxyHandler } from "aws-lambda";
import { generateToken } from "../../utils/jwt";
import { handleError } from "../../utils/errorHandler";
import { ValidationError } from "../../errors/ApplicationErrors";

interface GenerateTokenRequest {
  role: "customer" | "admin";
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: GenerateTokenRequest = JSON.parse(event.body || "{}");

    if (!body.role || !["customer", "admin"].includes(body.role)) {
      throw new ValidationError('Role must be either "customer" or "admin"');
    }

    const token = generateToken({ role: body.role });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    return handleError(error);
  }
};
