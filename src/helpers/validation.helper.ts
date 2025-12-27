export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
    [key: string]: ValidationRule;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
};

export const validateRequired = (value: any): boolean => {
    return value !== null && value !== undefined && value !== "";
};

export const validateMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
};

export const validateField = (
    value: any,
    rules: ValidationRule
): string | null => {
    if (rules.required && !validateRequired(value)) {
        return "This field is required";
    }

    if (value && rules.minLength && !validateMinLength(value, rules.minLength)) {
        return `Minimum length is ${rules.minLength}`;
    }

    if (value && rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
        return `Maximum length is ${rules.maxLength}`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
        return "Invalid format";
    }

    if (rules.custom) {
        const result = rules.custom(value);
        if (result !== true) {
            return typeof result === "string" ? result : "Validation failed";
        }
    }

    return null;
};

export const validateObject = (
    data: any,
    schema: ValidationSchema
): Record<string, string[]> => {
    const errors: Record<string, string[]> = {};

    for (const field in schema) {
        const error = validateField(data[field], schema[field]);
        if (error) {
            errors[field] = [error];
        }
    }

    return errors;
};