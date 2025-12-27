import { Router } from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    deleteOrder,
} from "../controllers/orders.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Create a new order
router.post("/", authMiddleware, createOrder);

// Get current user's orders
router.get("/my-orders", authMiddleware, getUserOrders);

// Get all orders (admin only)
router.get("/", authMiddleware, getAllOrders);

// Get order by ID
router.get("/:id", authMiddleware, getOrderById);

// Update order status
router.patch("/:id/status", authMiddleware, updateOrderStatus);

// Delete order (admin only)
router.delete("/:id", authMiddleware, deleteOrder);

export default router;