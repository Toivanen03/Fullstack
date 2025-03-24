"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middleware/errorHandler");
const cors_1 = __importDefault(require("cors"));
const diagnosisRouter_1 = __importDefault(require("./routes/diagnosisRouter"));
const patientsRouter_1 = __importDefault(require("./routes/patientsRouter"));
const app = (0, express_1.default)();
const PORT = 3001;
app.get('/api/ping', (_req, res) => {
    res.send('pong');
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/patients', patientsRouter_1.default);
app.use('/api/diagnoses', diagnosisRouter_1.default);
app.use(errorHandler_1.errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
