import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { generateToken, TokenResponse } from "../helpers/jwt.helper";
import { validateEmail, validatePassword, validateRequired } from "../helpers/validation.helper";
import { User } from "@prisma/client";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: Omit<User, "password">;
    token: string;
    expiresIn: string;
}

export class AuthService {
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        // Validate inputs
        if (!validateRequired(payload.name)) {
            throw new Error("Name is required");
        }

        if (!validateRequired(payload.email)) {
            throw new Error("Email is required");
        }

        if (!validateEmail(payload.email)) {
            throw new Error("Invalid email format");
        }

        if (!validateRequired(payload.password)) {
            throw new Error("Password is required");
        }

        if (!validatePassword(payload.password)) {
            throw new Error(
                "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (existingUser) {
            throw new Error("User already exists with this email");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
                role: "CUSTOMER",
            },
        });

        // Generate token
        const tokenResponse = generateToken(user.id, user.role);

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token: tokenResponse.token,
            expiresIn: tokenResponse.expiresIn,
        };
    }

    async login(payload: LoginPayload): Promise<AuthResponse> {
        // Validate inputs
        if (!validateRequired(payload.email)) {
            throw new Error("Email is required");
        }

        if (!validateEmail(payload.email)) {
            throw new Error("Invalid email format");
        }

        if (!validateRequired(payload.password)) {
            throw new Error("Password is required");
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(payload.password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        // Generate token
        const tokenResponse = generateToken(user.id, user.role);

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token: tokenResponse.token,
            expiresIn: tokenResponse.expiresIn,
        };
    }

    async getUserById(userId: number): Promise<Omit<User, "password"> | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

export default new AuthService();