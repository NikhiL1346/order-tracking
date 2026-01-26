import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config";  // Add this import

export interface JwtPayload {
    userId: number;
    role: Role;
}

export interface TokenResponse {
    token: string;
    expiresIn: string;
}

export const generateToken = (
    userId: number,
    role: Role
): TokenResponse => {
    const token = jwt.sign(
        { userId, role:role as string },
        env.JWT_SECRET ,
        { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
        token,
        expiresIn: env.JWT_EXPIRES_IN,  // ✅ Changed from hardcoded "24h"
    };
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(
            token,
            env.JWT_SECRET  // ✅ Changed from process.env.JWT_SECRET
        ) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const refreshToken = (userId: number, role: Role): TokenResponse => {
    return generateToken(userId, role);
};