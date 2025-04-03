import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    const errorMsg: string[] = [];
    error.errors.forEach((err: { message: string }) => {
      errorMsg.push(`• ${err.message}`);
    });
    res.status(400).send(errorMsg);
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
  next();
};