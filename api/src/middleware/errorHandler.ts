import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof AppError) {
        res.status(err.status).json({ error: err.message });
        return;
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
}

export function requireFields<T extends object>(body: T, fields: (keyof T)[]): void {
    for (const f of fields) {
        if (!body[f]) {
            throw new AppError(400, `${String(f)} is required`);
        }
    }
}