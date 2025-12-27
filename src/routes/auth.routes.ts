import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get current user profile
router.get("/me", authMiddleware, getCurrentUser);

export default router;
