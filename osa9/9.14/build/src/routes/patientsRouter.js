"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientsService_1 = __importDefault(require("../services/patientsService"));
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
const patientsRouter = express_1.default.Router();
const newPatientParser = (req, _res, next) => {
    if (!req.body.id) {
        req.body.id = (0, uuid_1.v4)();
    }
    ;
    try {
        utils_1.newEntrySchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
    ;
};
patientsRouter.get('/', (_req, res) => {
    res.send(patientsService_1.default.getPatients());
});
patientsRouter.post('/', newPatientParser, (req, res) => {
    const addedEntry = patientsService_1.default.addPatient(req.body);
    res.json(addedEntry);
});
exports.default = patientsRouter;
