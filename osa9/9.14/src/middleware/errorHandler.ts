import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
      res.status(400).json(error.errors.map((err) => err.message).join('\n'));
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
    next();
  };