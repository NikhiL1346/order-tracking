import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { validationErrorResponse } from "../helpers/error.helper";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages: Record<string, string[]> = {};
    errors.array().forEach((error) => {
      if (error.type === "field") {
        const field = error.path;
        if (!errorMessages[field]) {
          errorMessages[field] = [];
        }
        errorMessages[field].push(error.msg);
      }
    });

    return res
      .status(400)
      .json(validationErrorResponse(errorMessages));
  };
};