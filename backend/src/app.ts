import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { testDatabaseConnection } from "./config/database";
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

const app = express();

// middleware first
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// then routes
app.use("/api/v1/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "alzGuardian-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/health/db", async (_req, res) => {
  try {
    const result = await testDatabaseConnection();
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: result.now,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

export default app;
