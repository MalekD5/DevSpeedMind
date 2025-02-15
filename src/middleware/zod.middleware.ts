import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";

// biome-ignore lint/suspicious/noExplicitAny: <we don't care about zod object definition, can be any>
export function validateBody(schema: z.ZodObject<any, any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				// biome-ignore lint/suspicious/noExplicitAny: <we don't care about zod error definition, can be any>
				const errorMessages = error.errors.map((issue: any) => ({
					message: `${issue.path.join(".")} is ${issue.message}`,
				}));
				res.status(400).json({ error: "Invalid data", details: errorMessages });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	};
}
