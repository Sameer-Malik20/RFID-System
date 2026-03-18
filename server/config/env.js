import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const configDir = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(configDir, "../..");
const serverRoot = resolve(configDir, "..");

dotenv.config({ path: resolve(projectRoot, ".env") });
dotenv.config({ path: resolve(serverRoot, ".env"), override: true });

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-this-secret",
  autoSeed: String(process.env.AUTO_SEED ?? "true").toLowerCase() === "true",
};
