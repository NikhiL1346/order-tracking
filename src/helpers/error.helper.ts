export interface ErrorResponse {
    success: boolean;
    message: string;
    errorCode: string;
    statusCode: number;
    errors?: string[];
    timestamp: string;
}

export const validationErrorResponse = (errors: Record<string, string[]>): ErrorResponse => {
    return {
        success: false,
        message: "Validation failed!",
        errorCode: "VALIDATION_ERROR",
        statusCode: 400,
        errors: Object.values(errors).flat(),
        timestamp: new Date().toISOString(),
    };
};

export const notFoundError = (resource: string): ErrorResponse => {
    return {
        success: false,
        message: `${resource} not found`,
        errorCode: "NOT_FOUND",
        statusCode: 404,
        timestamp: new Date().toISOString(),
    };
};

export const unauthorizedError = (message: string = "Unauthorized"): ErrorResponse => {
    return {
        success: false,
        message,
        errorCode: "UNAUTHORIZED",
        statusCode: 401,
        timestamp: new Date().toISOString(),
    };
};

export const forbiddenError = (message: string = "Forbidden"): ErrorResponse => {
    return {
        success: false,
        message,
        errorCode: "FORBIDDEN",
        statusCode: 403,
        timestamp: new Date().toISOString(),
    };
};

export const internalServerError = (message: string = "Internal server error"): ErrorResponse => {
    return {
        success: false,
        message,
        errorCode: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
        timestamp: new Date().toISOString(),
    };
};