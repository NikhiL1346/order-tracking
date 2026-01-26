import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";
import { generalRateLimiter } from "./middleware/rateLimit.middleware";
import { requestLogger } from "./middleware/req.logger.middleware";
import { logger } from "./utils/logger";
import { env } from "./config/env.config";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use("/api", generalRateLimiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errorCode: "NOT_FOUND",
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    requestId: req.requestId,
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
    errorCode: "INTERNAL_ERROR",
    statusCode: 500,
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default app;