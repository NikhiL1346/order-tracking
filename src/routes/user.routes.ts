import { Router } from "express";
import {
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    getUsersByRole,
    searchUsers,
} from "../controllers/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Get all users (admin only)
router.get("/", authMiddleware, getAllUsers);

// Get users by role (admin only)
router.get("/role", authMiddleware, getUsersByRole);

// Search users (admin only)
router.get("/search", authMiddleware, searchUsers);

// Get user by ID
router.get("/:id", authMiddleware, getUserById);

// Update user
router.patch("/:id", authMiddleware, updateUser);

// Delete user
router.delete("/:id", authMiddleware, deleteUser);

export default router;
