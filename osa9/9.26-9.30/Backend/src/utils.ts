import { NewPatientEntry, Gender, NewDiagnosticsEntry } from "./types";
import { z, ZodError } from "zod";

const baseEntrySchema = z.object({
    id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, {
        message: "ID error!"
    }),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Date must be YYYY-MM-DD!"
    }),
    specialist: z.string().regex(/^[a-zåäö.-]{1,}(?: [a-zåäö.-]{1,})*$/i, {
        message: "Invalid or missing specialist!"
    }),
    diagnosisCodes: z.array(z.string()).optional(),
    description: z.string().min(5, {
        message: "Description is required!"
    }),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.number().refine((val) => {
        return val >= 0 && val <= 3;
    }, {
        message: "Select health risk rating!",
    }),
});

const hospitalEntrySchema = baseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
        date: z.string(),
        criteria: z.string(),
    }).optional(),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string().min(2, {
        message: "Missing employer!"
    }),
    sickLeave: z.object({
        startDate: z.string(),
        endDate: z.string(),
    }).optional(),
});


export const entrySchema = z.union([
    healthCheckEntrySchema,
    hospitalEntrySchema,
    occupationalHealthcareEntrySchema,
]);

export const newDiagnosticsSchema = z.array(entrySchema);

export const toNewDiagnosis = (object: unknown): NewDiagnosticsEntry => {
    const entries = newDiagnosticsSchema.parse(object);
    return entries;
};

export const patientEntrySchema = z.object ({
    id: z.string().regex((/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/), {
        message: "ID error!"
    }),
    name: z.string().regex((/^[a-zåäö]{2,} [a-zåäö]{2,}$/i), {
        message: "Invalid or missing name!"
    }),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Date must be YYYY-MM-DD!",
      }),
    ssn: z.string().regex((/^[0-9]{6}([A-F-+YXWVU])[0-9]{3}[0-9a-z]{1}$/i), {
        message: "Invalid SSN!"
    }),
    gender: z.nativeEnum((Gender), {
        message: "Gender error!"
    }),
    occupation: z.string().min((3), {
        message: "Occupation must be at least 3 characters!"
    }),
    entries: z.array(entrySchema).optional()
});

export const toPatient = (object: unknown): NewPatientEntry => {
    const result = patientEntrySchema.safeParse(object);
    if (!result.success) {
        throw new ZodError(result.error.errors);
    }
    return result.data;
};