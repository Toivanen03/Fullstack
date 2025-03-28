"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewPatient = exports.newEntrySchema = void 0;
const types_1 = require("./types");
const zod_1 = require("zod");
exports.newEntrySchema = zod_1.z.object({
    id: zod_1.z.string().regex((/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/), {
        message: "ID error!"
    }),
    name: zod_1.z.string().regex((/^[a-zåäö]{2,} [a-zåäö]{2,}$/i), {
        message: "Invalid or missing name!"
    }),
    dateOfBirth: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Date must be YYYY-MM-DD!",
    }),
    ssn: zod_1.z.string().regex((/^[0-9]{6}([A-F\-\+YXWVU])[0-9]{3}[0-9a-z]{1}$/i), {
        message: "Invalid SSN!"
    }),
    gender: zod_1.z.nativeEnum((types_1.Gender), {
        message: "Gender error!"
    }),
    occupation: zod_1.z.string().min((3), {
        message: "Occupation must be at least 3 characters!"
    }),
});
const toNewPatient = (object) => {
    const patient = exports.newEntrySchema.parse(object);
    return patient;
};
exports.toNewPatient = toNewPatient;
