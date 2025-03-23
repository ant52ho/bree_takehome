import jwt from "jsonwebtoken";
import config from "../config";

const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

export interface JWTPayload {
  role: "customer" | "admin";
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};
