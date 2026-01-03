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
import { allowRoles } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Create a new order (CUSTOMER only)
router.post(
  "/",
  authMiddleware,
  allowRoles([Role.CUSTOMER]),
  createOrder
);

// Get current user's orders (CUSTOMER only)
router.get(
  "/my-orders",
  authMiddleware,
  allowRoles([Role.CUSTOMER]),
  getUserOrders
);

// Get all orders (ADMIN only)
router.get(
  "/",
  authMiddleware,
  allowRoles([Role.ADMIN]),
  getAllOrders
);

// Get order by ID (CUSTOMER & ADMIN)
router.get(
  "/:id",
  authMiddleware,
  allowRoles([Role.CUSTOMER, Role.ADMIN]),
  getOrderById
);

// Update order status (DELIVERY_PARTNER & ADMIN)
router.patch(
  "/:id/status",
  authMiddleware,
  allowRoles([Role.DELIVERY_PARTNER, Role.ADMIN]),
  updateOrderStatus
);

// Delete order (ADMIN only)
router.delete(
  "/:id",
  authMiddleware,
  allowRoles([Role.ADMIN]),
  deleteOrder
);

export default router;
