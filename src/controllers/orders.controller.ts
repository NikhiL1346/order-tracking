import { Request, Response } from "express";
import ordersService from "../services/orders.service";
import {
    successResponse,
    createdResponse,
    deletedResponse,
} from "../helpers/response.helper";
import {
    validationErrorResponse,
    notFoundError,
    unauthorizedError,
} from "../helpers/error.helper";

export const createOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        // Call service
        const order = await ordersService.createOrder({
            userId: req.user.userId,
        });

        return res.status(201).json(
            createdResponse(order, "Order created successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to create order";

        if (
            errorMessage.includes("not found") ||
            errorMessage.includes("required")
        ) {
            return res.status(400).json(
                validationErrorResponse({
                    general: [errorMessage],
                })
            );
        }

        return res.status(500).json(
            validationErrorResponse({
                general: ["Failed to create order"],
            })
        );
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        // Call service
        const orders = await ordersService.getUserOrders(req.user.userId);

        return res.status(200).json(
            successResponse(orders, "Orders fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch orders";

        if (errorMessage.includes("not found")) {
            return res.status(404).json(notFoundError("User"));
        }

        return res.status(500).json(
            validationErrorResponse({
                general: ["Failed to fetch orders"],
            })
        );
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const orderId = Number(req.params.id);

        if (!orderId || isNaN(orderId)) {
            return res.status(400).json(
                validationErrorResponse({
                    id: ["Invalid order ID"],
                })
            );
        }

        // Call service
        const order = await ordersService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json(notFoundError("Order"));
        }

        // Check authorization
        if (order.userId !== req.user.userId && req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError("You don't have permission to view this order")
            );
        }

        return res.status(200).json(
            successResponse(order, "Order fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch order";

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const orderId = Number(req.params.id);
        const { status } = req.body;

        // Validate order ID
        if (!orderId || isNaN(orderId)) {
            return res.status(400).json(
                validationErrorResponse({
                    id: ["Invalid order ID"],
                })
            );
        }

        // Validate status
        if (!status) {
            return res.status(400).json(
                validationErrorResponse({
                    status: ["Status is required"],
                })
            );
        }

        // Check authorization (admin or delivery partner can update)
        if (
            req.user.role !== "ADMIN" &&
            req.user.role !== "DELIVERY_PARTNER"
        ) {
            return res.status(403).json(
                unauthorizedError(
                    "You don't have permission to update order status"
                )
            );
        }

        // Call service
        const updatedOrder = await ordersService.updateOrderStatus(orderId, {
            status,
        });

        return res.status(200).json(
            successResponse(updatedOrder, "Order status updated successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to update order";

        if (errorMessage.includes("not found")) {
            return res.status(404).json(notFoundError("Order"));
        }

        if (errorMessage.includes("Invalid")) {
            return res.status(400).json(
                validationErrorResponse({
                    general: [errorMessage],
                })
            );
        }

        return res.status(500).json(
            validationErrorResponse({
                general: ["Failed to update order status"],
            })
        );
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        // Check authorization (only admin can view all orders)
        if (req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError("You don't have permission to view all orders")
            );
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Call service
        const result = await ordersService.getAllOrders(limit, offset);

        return res.status(200).json(
            successResponse(result, "Orders fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch orders";

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const orderId = Number(req.params.id);

        // Validate order ID
        if (!orderId || isNaN(orderId)) {
            return res.status(400).json(
                validationErrorResponse({
                    id: ["Invalid order ID"],
                })
            );
        }

        // Check authorization (only admin can delete)
        if (req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError("You don't have permission to delete orders")
            );
        }

        // Call service
        await ordersService.deleteOrder(orderId);

        return res.status(200).json(
            deletedResponse("Order deleted successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to delete order";

        if (errorMessage.includes("not found")) {
            return res.status(404).json(notFoundError("Order"));
        }

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};
