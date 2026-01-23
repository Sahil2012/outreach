import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

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
            return res.status(400).json({
                error: "Validation failed",
                details: JSON.parse(error.message)
            });
        }
    };
};