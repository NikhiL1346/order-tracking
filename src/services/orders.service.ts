import prisma from "../utils/prisma";
import { Status, Order } from "@prisma/client";
import { validateRequired } from "../helpers/validation.helper";

export interface CreateOrderPayload {
    userId: number;
}

export interface UpdateOrderStatusPayload {
    status: Status;
}

export class OrdersService {
    async createOrder(payload: CreateOrderPayload): Promise<Order> {
        // Validate inputs
        if (!validateRequired(payload.userId)) {
            throw new Error("UserId is required");
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: payload.userId,
                status: "PLACED",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return order as Order;
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        // Validate inputs
        if (!validateRequired(userId)) {
            throw new Error("UserId is required");
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Get user's orders
        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return orders as Order[];
    }

    async getOrderById(orderId: number): Promise<Order | null> {
        // Validate inputs
        if (!validateRequired(orderId)) {
            throw new Error("OrderId is required");
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        if (!order) {
            return null;
        }

        return order as Order;
    }

    async updateOrderStatus(
        orderId: number,
        payload: UpdateOrderStatusPayload
    ): Promise<Order> {
        // Validate inputs
        if (!validateRequired(orderId)) {
            throw new Error("OrderId is required");
        }

        if (!validateRequired(payload.status)) {
            throw new Error("Status is required");
        }

        // Verify status is valid
        const validStatuses: Status[] = [
            "PLACED",
            "ACCEPTED",
            "PICKED_UP",
            "ON_THE_WAY",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!validStatuses.includes(payload.status)) {
            throw new Error("Invalid status");
        }

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder) {
            throw new Error("Order not found");
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: payload.status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return updatedOrder as Order;
    }

    async getAllOrders(
        limit: number = 10,
        offset: number = 0
    ): Promise<{ orders: Order[]; total: number }> {
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma.order.count(),
        ]);

        return { orders: orders as Order[], total };
    }

    async deleteOrder(orderId: number): Promise<void> {
        // Validate inputs
        if (!validateRequired(orderId)) {
            throw new Error("OrderId is required");
        }

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Delete order
        await prisma.order.delete({
            where: { id: orderId },
        });
    }
}

export default new OrdersService();
