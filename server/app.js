import cors from "cors";
import express from "express";
import { getHealth } from "./controllers/healthController.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { assetRoutes } from "./routes/assetRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { requestRoutes } from "./routes/requestRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { workspaceRoutes } from "./routes/workspaceRoutes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", getHealth);
  app.use("/api/auth", authRoutes);
  app.use("/api", workspaceRoutes, assetRoutes, userRoutes, requestRoutes, notificationRoutes);
  app.use(errorMiddleware);

  return app;
}
