import { z } from 'zod';
import { newEntrySchema } from './utils';

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
};

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
};

export interface Patient extends NewPatientEntry {
    id: string;
};

export type NewPatientEntry = z.infer<typeof newEntrySchema>;
export type FilteredFields = Omit<Patient, 'ssn'>;