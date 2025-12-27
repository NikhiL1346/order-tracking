import prisma from "../utils/prisma";
import { User, Role } from "@prisma/client";
import { validateRequired, validateEmail } from "../helpers/validation.helper";
import bcrypt from "bcryptjs";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: Role;
}

export class UsersService {
  async getUserById(userId: number): Promise<Omit<User, "password"> | null> {
    // Validate inputs
    if (!validateRequired(userId)) {
      throw new Error("UserId is required");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ users: Omit<User, "password">[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.user.count(),
    ]);

    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return { users: usersWithoutPasswords, total };
  }

  async updateUser(
    userId: number,
    payload: UpdateUserPayload
  ): Promise<Omit<User, "password">> {
    // Validate inputs
    if (!validateRequired(userId)) {
      throw new Error("UserId is required");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Validate email if provided
    if (payload.email && payload.email !== user.email) {
      if (!validateEmail(payload.email)) {
        throw new Error("Invalid email format");
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    // Validate name if provided
    if (payload.name && !validateRequired(payload.name)) {
      throw new Error("Name cannot be empty");
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.email && { email: payload.email }),
        ...(payload.role && { role: payload.role }),
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: number): Promise<void> {
    // Validate inputs
    if (!validateRequired(userId)) {
      throw new Error("UserId is required");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user's orders first (due to foreign key constraint)
    await prisma.order.deleteMany({
      where: { userId },
    });

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  async getUsersByRole(role: Role): Promise<Omit<User, "password">[]> {
    // Validate inputs
    if (!validateRequired(role)) {
      throw new Error("Role is required");
    }

    const users = await prisma.user.findMany({
      where: { role },
      orderBy: { id: "desc" },
    });

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async searchUsers(searchQuery: string): Promise<Omit<User, "password">[]> {
    // Validate inputs
    if (!validateRequired(searchQuery)) {
      throw new Error("Search query is required");
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery } },
          { email: { contains: searchQuery } },
        ],
      },
      orderBy: { id: "desc" },
    });

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

export default new UsersService();
