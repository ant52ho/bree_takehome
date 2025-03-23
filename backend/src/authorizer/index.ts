import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import jwt from "jsonwebtoken";
import config from "../config";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    // Extract token from the Authorization header
    const authHeader = event.authorizationToken;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Invalid authorization header:", authHeader);
      throw new Error("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      role: "customer" | "admin";
    };

    // Generate the IAM policy
    return generatePolicy(decoded.role, "Allow", event.methodArn);
  } catch (error) {
    console.error("Authorization error:", error);
    throw new Error("Unauthorized");
  }
};

const generatePolicy = (
  role: string,
  effect: "Allow" | "Deny",
  resource: string
): APIGatewayAuthorizerResult => {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId: role,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      role,
    },
  };

  return authResponse;
};
