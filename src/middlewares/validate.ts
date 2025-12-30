import { Request, Response, NextFunction } from "express";
import { AnyObjectSchema } from "yup";

/**
 * Schema Validator Middleware
 */
export const validate =
    (schema: AnyObjectSchema, property: "body" | "query" | "params" = "body") =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const validatedData = await schema.validate(req[property], {
                    abortEarly: false,
                    stripUnknown: true,
                });

                // overwrite request with validated & sanitized data
                req[property] = validatedData;
                next();
            } catch (error: any) {
                return res.status(400).json({
                    message: "Validation failed",
                    details: error.inner?.map((err: any) => ({
                        path: err.path,
                        message: err.message,
                    })),
                });
            }
        };
