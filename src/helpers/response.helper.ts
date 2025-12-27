export interface ApiResponse<T> {
    success: boolean;
    message: string;
    responseCode: string;
    statusCode: number;
    data?: T;
    errors?: string[];
    timestamp: string;
}

export const successResponse = <T>(
    data: T,
    message: string = "Success"
): ApiResponse<T> => {
    return {
        success: true,
        message,
        responseCode: "SUCCESS",
        statusCode: 200,
        data,
        timestamp: new Date().toISOString(),
    };
};

export const createdResponse = <T>(
    data: T,
    message: string = "Created successfully"
): ApiResponse<T> => {
    return {
        success: true,
        message,
        responseCode: "CREATED",
        statusCode: 201,
        data,
        timestamp: new Date().toISOString(),
    };
};

export const deletedResponse = (
    message: string = "Deleted successfully"
): ApiResponse<null> => {
    return {
        success: true,
        message,
        responseCode: "DELETED",
        statusCode: 200,
        timestamp: new Date().toISOString(),
    };
};

export const paginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = "Success"
) => {
    return {
        success: true,
        message,
        responseCode: "PAGINATED_SUCCESS",
        statusCode: 200,
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
        timestamp: new Date().toISOString(),
    };
};

export const errorResponse = (
    message: string,
    errors?: string[]
): ApiResponse<null> => {
    return {
        success: false,
        message,
        responseCode: "ERROR",
        statusCode: 400,
        errors,
        timestamp: new Date().toISOString(),
    };
};