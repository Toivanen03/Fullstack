import { NewPatientEntry, Gender } from "./types";
import { z } from "zod";

export const newEntrySchema = z.object({
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
});

export const toNewPatient = (object: unknown): NewPatientEntry => {
    const patient = newEntrySchema.parse(object);
    return patient;
};