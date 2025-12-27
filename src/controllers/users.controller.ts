import { Request, Response } from "express";
import usersService from "../services/users.service";
import {
    successResponse,
} from "../helpers/response.helper";
import {
    validationErrorResponse,
    notFoundError,
    unauthorizedError,
} from "../helpers/error.helper";
import { Role } from "@prisma/client";

export const getUserById = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const userId = Number(req.params.id);

        // Validate user ID
        if (!userId || isNaN(userId)) {
            return res.status(400).json(
                validationErrorResponse({
                    id: ["Invalid user ID"],
                })
            );
        }

        // Check authorization (can view own profile or admin can view any)
        if (userId !== req.user.userId && req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError(
                    "You don't have permission to view this profile"
                )
            );
        }

        // Call service
        const user = await usersService.getUserById(userId);

        if (!user) {
            return res.status(404).json(notFoundError("User"));
        }

        return res.status(200).json(
            successResponse(user, "User fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch user";

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        // Check authorization (only admin can view all users)
        if (req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError("You don't have permission to view all users")
            );
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Call service
        const result = await usersService.getAllUsers(limit, offset);

        return res.status(200).json(
            successResponse(result, "Users fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch users";

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const userId = Number(req.params.id);

        // Validate user ID
        if (!userId || isNaN(userId)) {
            return res.status(400).json(
                validationErrorResponse({
                    id: ["Invalid user ID"],
                })
            );
        }

        // Check authorization (can update own profile or admin can update any)
        if (userId !== req.user.userId && req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError(
                    "You don't have permission to update this profile"
                )
            );
        }

        const { name, email, role } = req.body;

        // Call service
        const updatedUser = await usersService.updateUser(userId, {
            name,
            email,
            role,
        });

        return res.status(200).json(
            successResponse(updatedUser, "User updated successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to update user";

        if (errorMessage.includes("not found")) {
            return res.status(404).json(notFoundError("User"));
        }

        if (
            errorMessage.includes("Invalid") ||
            errorMessage.includes("already in use") ||
            errorMessage.includes("cannot be empty")
        ) {
            return res.status(400).json(
                validationErrorResponse({
                    general: [errorMessage],
                })
            );
        }

        return res.status(500).json(
            validationErrorResponse({
                general: ["Failed to update user"],
            })
        );
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const userId = Number(req.params.id);

        // Validate user ID
        if (!userId || isNaN(userId)) {
            return res.status(400).json(
                validationErrorResponse({
                    id: ["Invalid user ID"],
                })
            );
        }

        // Check authorization (can delete own account or admin can delete any)
        if (userId !== req.user.userId && req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError(
                    "You don't have permission to delete this profile"
                )
            );
        }

        // Call service
        await usersService.deleteUser(userId);

        return res.status(200).json(
            successResponse(null, "User deleted successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to delete user";

        if (errorMessage.includes("not found")) {
            return res.status(404).json(notFoundError("User"));
        }

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};

export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        // Check authorization (only admin can view users by role)
        if (req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError(
                    "You don't have permission to view users by role"
                )
            );
        }

        const role = req.query.role as Role;

        if (!role) {
            return res.status(400).json(
                validationErrorResponse({
                    role: ["Role is required"],
                })
            );
        }

        // Call service
        const users = await usersService.getUsersByRole(role);

        return res.status(200).json(
            successResponse(users, "Users fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch users";

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        // Check authorization (only admin can search users)
        if (req.user.role !== "ADMIN") {
            return res.status(403).json(
                unauthorizedError(
                    "You don't have permission to search users"
                )
            );
        }

        const query = req.query.q as string;

        if (!query) {
            return res.status(400).json(
                validationErrorResponse({
                    query: ["Search query is required"],
                })
            );
        }

        // Call service
        const users = await usersService.searchUsers(query);

        return res.status(200).json(
            successResponse(users, "Users found successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to search users";

        return res.status(500).json(
            validationErrorResponse({
                general: [errorMessage],
            })
        );
    }
};
