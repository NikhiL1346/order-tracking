import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

// Register user
router.post("/register", authRateLimiter, registerUser);

// Login user
router.post("/login", authRateLimiter, loginUser);

// Get current user profile
router.get("/me", authMiddleware, getCurrentUser);

export default router;