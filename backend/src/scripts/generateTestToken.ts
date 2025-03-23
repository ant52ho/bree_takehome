import { generateToken, verifyToken } from "../utils/jwt";

// Example usage:
// npm run generate-token -- --role=customer
// npm run generate-token -- --role=admin

const args = process.argv.slice(2);
const role = args.find((arg) => arg.startsWith("--role="))?.split("=")[1];

if (!role || !["customer", "admin"].includes(role)) {
  console.error("Usage: npm run generate-token -- --role=<customer|admin>");
  process.exit(1);
}

const token = generateToken({ role: role as "customer" | "admin" });
console.log("Generated Token:");
console.log(token);

// Verify the token
try {
  const decoded = verifyToken(token);
  console.log("\nVerified Token Payload:");
  console.log(JSON.stringify(decoded, null, 2));
} catch (error) {
  console.error("\nToken verification failed:", error);
}
