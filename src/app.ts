import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "OK", message: "Server is running" });
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
    console.error("Error:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        errorCode: "INTERNAL_ERROR",
        statusCode: 500,
        timestamp: new Date().toISOString(),
    });
});

export default app;
