import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../helpers/jwt.helper";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
            errorCode: "UNAUTHORIZED",
            statusCode: 401,
            timestamp: new Date().toISOString(),
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid token format",
            errorCode: "UNAUTHORIZED",
            statusCode: 401,
            timestamp: new Date().toISOString(),
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            errorCode: "UNAUTHORIZED",
            statusCode: 401,
            timestamp: new Date().toISOString(),
        });
    }

    req.user = decoded;
    next();
};
