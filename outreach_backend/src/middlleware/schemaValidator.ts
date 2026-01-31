import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { BadRequestError } from "../types/HttpError.js";
import { ErrorCode } from "../types/errorCodes.js";

interface RequestValidationSchema {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

export const validate = (schemas: RequestValidationSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => {
                    const path = issue.path.length > 0 ? issue.path.join('.') : 'Input';
                    return `${path} : ${issue.message}`
                }).join(', ');
                return next(new BadRequestError(errorMessages, ErrorCode.VALIDATION_FAILED, { issues: error.errors }));
            }
            next(error);
        }
    };
};