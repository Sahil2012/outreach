import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const schemaValidator = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validated = schema.safeParse(req.body);

        if (!validated.success) {
            return res.status(400).json({
                message: validated.error.errors[0].message
            })
        }

        req.body = validated.data;
        next();
    }
}