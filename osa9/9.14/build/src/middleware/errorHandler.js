"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const errorMiddleware = (error, _req, res, next) => {
    if (error instanceof zod_1.z.ZodError) {
        const messages = error.errors.map((err) => err.message).join('\n');
        res.status(400).json(messages);
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
    next();
};
exports.errorMiddleware = errorMiddleware;
