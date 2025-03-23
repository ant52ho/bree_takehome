import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
interface Config {
  jwt: {
    secret: string;
    expiresIn: number;
  };
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  aws: {
    region: string;
  };
}

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "86400", 10),
  },
  database: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    database: process.env.POSTGRES_DB || "bree_db",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
  },
  aws: {
    region: process.env.AWS_REGION || "us-east-1",
  },
};

// Validate required environment variables
const requiredEnvVars = [
  "JWT_SECRET",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_DB",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "AWS_REGION",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export default config;
