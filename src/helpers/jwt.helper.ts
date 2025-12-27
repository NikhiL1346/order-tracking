import jwt from "jsonwebtoken";

export interface JwtPayload {
    userId: number;
    role: string;
}

export interface TokenResponse {
    token: string;
    expiresIn: string;
}

export const generateToken = (
    userId: number,
    role: string
): TokenResponse => {
    const token = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
    );

    return {
        token,
        expiresIn: "24h",
    };
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
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

export const refreshToken = (userId: number, role: string): TokenResponse => {
    return generateToken(userId, role);
};