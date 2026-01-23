import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const schemaValidator = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validated = await schema.safeParseAsync(req.body);

        if (!validated.success) {
            return res.status(400).json({
                error: validated.error.errors.map(e => e.message).join(", "),
                details: validated.error.errors
            })
        }

        req.body = validated.data;
        next();
    }
}