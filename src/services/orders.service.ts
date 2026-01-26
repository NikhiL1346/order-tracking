import prisma from "../utils/prisma";
import { Status, Order } from "@prisma/client";
import { validateRequired } from "../helpers/validation.helper";
import { randomBytes } from "crypto";
import emailService from "./email.service";
import { logger } from "../utils/logger";

export interface CreateOrderPayload {
  userId: number;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  notes?: string;
}

export interface UpdateOrderStatusPayload {
  status: Status;
  notes?: string;
}

export class OrdersService {
  private generateTrackingNumber(): string {
    return `TRK${randomBytes(6).toString("hex").toUpperCase()}`;
  }

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (!validateRequired(payload.userId)) {
      throw new Error("UserId is required");
    }

    if (!payload.items || payload.items.length === 0) {
      throw new Error("Order items are required");
    }

    if (!validateRequired(payload.shippingAddress)) {
      throw new Error("Shipping address is required");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const totalAmount = payload.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const trackingNumber = this.generateTrackingNumber();

    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        status: "PLACED",
        totalAmount,
        shippingAddress: payload.shippingAddress,
        trackingNumber,
        notes: payload.notes,
        items: {
          create: payload.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        statusHistory: {
          create: {
            status: "PLACED",
            notes: "Order placed",
          },
        },
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
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Send confirmation email
    try {
      await emailService.sendOrderConfirmation(
        user.email,
        order.id,
        trackingNumber,
        totalAmount
      );
    } catch (error) {
      logger.error("Failed to send order confirmation email:", error);
      // Don't throw - order is created successfully
    }

    return order as Order;
  }

  async updateOrderStatus(
    orderId: number,
    payload: UpdateOrderStatusPayload
  ): Promise<Order> {
    if (!validateRequired(orderId)) {
      throw new Error("OrderId is required");
    }

    if (!validateRequired(payload.status)) {
      throw new Error("Status is required");
    }

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

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: payload.status,
        statusHistory: {
          create: {
            status: payload.status,
            notes: payload.notes,
          },
        },
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
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Send status update email
    try {
      await emailService.sendOrderStatusUpdate(
        existingOrder.user.email,
        orderId,
        payload.status,
        updatedOrder.trackingNumber || undefined
      );
    } catch (error) {
      logger.error("Failed to send status update email:", error);
    }

    return updatedOrder as Order;
  }

  // Update other methods similarly to include items and statusHistory
  async getUserOrders(userId: number): Promise<Order[]> {
    if (!validateRequired(userId)) {
      throw new Error("UserId is required");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

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
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return orders as Order[];
  }

  async getOrderById(orderId: number): Promise<Order | null> {
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
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return null;
    }

    return order as Order;
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
          items: true,
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.order.count(),
    ]);

    return { orders: orders as Order[], total };
  }

  async deleteOrder(orderId: number): Promise<void> {
    if (!validateRequired(orderId)) {
      throw new Error("OrderId is required");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await prisma.order.delete({
      where: { id: orderId },
    });
  }
}

export default new OrdersService();