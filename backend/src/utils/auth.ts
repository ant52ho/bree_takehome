import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "../errors/ApplicationErrors";

export const requireRole = (
  event: APIGatewayProxyEvent,
  allowedRoles: ("customer" | "admin")[]
) => {
  const role = event.requestContext.authorizer?.role;

  if (!role || !allowedRoles.includes(role)) {
    throw new UnauthorizedError(
      `Access denied. Required roles: ${allowedRoles.join(", ")}`
    );
  }

  return role;
};
