import { Request, Response } from "express";
import authService from "../services/auth.service";
import {
    successResponse,
    createdResponse,
} from "../helpers/response.helper";
import {
    validationErrorResponse,
    unauthorizedError,
} from "../helpers/error.helper";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        const errors: Record<string, string[]> = {};

        if (!name) errors.name = ["Name is required"];
        if (!email) errors.email = ["Email is required"];
        if (!password) errors.password = ["Password is required"];

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(validationErrorResponse(errors));
        }

        // Call service
        const result = await authService.register({ name, email, password });

        return res.status(201).json(
            createdResponse(result, "User registered successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Registration failed";

        // Check if it's a validation error
        if (
            errorMessage.includes("already exists") ||
            errorMessage.includes("required") ||
            errorMessage.includes("Invalid") ||
            errorMessage.includes("must be")
        ) {
            return res.status(400).json(
                validationErrorResponse({
                    general: [errorMessage],
                })
            );
        }

        return res.status(500).json(
            validationErrorResponse({
                general: ["Registration failed"],
            })
        );
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        const errors: Record<string, string[]> = {};

        if (!email) errors.email = ["Email is required"];
        if (!password) errors.password = ["Password is required"];

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(validationErrorResponse(errors));
        }

        // Call service
        const result = await authService.login({ email, password });

        return res.status(200).json(
            successResponse(result, "User logged in successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Login failed";

        if (errorMessage.includes("Invalid credentials")) {
            return res.status(401).json(unauthorizedError(errorMessage));
        }

        if (
            errorMessage.includes("required") ||
            errorMessage.includes("Invalid")
        ) {
            return res.status(400).json(
                validationErrorResponse({
                    general: [errorMessage],
                })
            );
        }

        return res.status(500).json(
            unauthorizedError("Login failed")
        );
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json(
                unauthorizedError("User not authenticated")
            );
        }

        const user = await authService.getUserById(req.user.userId);

        if (!user) {
            return res.status(404).json(
                validationErrorResponse({
                    general: ["User not found"],
                })
            );
        }

        return res.status(200).json(
            successResponse(user, "User fetched successfully")
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch user";

        return res.status(500).json(
            unauthorizedError(errorMessage)
        );
    }
};