import { NewPatientEntry, Gender, HealthCheckRating } from "./types";
import { z } from "zod";

const healthCheckEntrySchema = z.object({
    id: z.string(),
    date: z.string(),
    type: z.literal("HealthCheck"),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    description: z.string(),
    healthCheckRating: z.nativeEnum(HealthCheckRating),
  });
  
const hospitalEntrySchema = z.object({
    id: z.string(),
    date: z.string(),
    type: z.literal("Hospital"),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    description: z.string(),
    discharge: z.object({
        date: z.string(),
        criteria: z.string(),
    }),
});

const occupationalHealthcareEntrySchema = z.object({
    id: z.string(),
    date: z.string(),
    type: z.literal("OccupationalHealthcare"),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    description: z.string(),
    employerName: z.string(),
    sickLeave: z.object({
        startDate: z.string(),
        endDate: z.string(),
    }).optional(),
});

const entrySchema = z.union([
    healthCheckEntrySchema,
    hospitalEntrySchema,
    occupationalHealthcareEntrySchema,
]);

export const newPatientEntrySchema = z.object({
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
    entries: z.array(entrySchema)
    })

export const toNewPatient = (object: unknown): NewPatientEntry => {
    const patient = newPatientEntrySchema.parse(object);
    return patient;
};