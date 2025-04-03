import { z } from 'zod';
import { patientEntrySchema, newDiagnosticsSchema } from './utils';

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

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
    'Healthy' = 0,
    'LowRisk' = 1,
    'HighRisk' = 2,
    'CriticalRisk' = 3
}

interface HospitalEntry extends BaseEntry {
    type: 'Hospital';
    discharge?: {
        date: string;
        criteria: string;
    };
}

interface OccupationalHealthcareEntry extends BaseEntry {
    type: 'OccupationalHealthcare';
    employerName: string;
    sickLeave?: {
        startDate: string;
        endDate: string;
    };
}

interface HealthCheckEntry extends BaseEntry {
    type: 'HealthCheck';
    healthCheckRating: HealthCheckRating;
}

export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;

export type NewEntry =
    | Omit<HospitalEntry, 'id' | 'date'>
    | Omit<OccupationalHealthcareEntry, 'id' | 'date'>
    | Omit<HealthCheckEntry, 'id' | 'date'>;

export interface Patient {
    id: string;
    name: string;
    ssn: string;
    occupation: string;
    gender: Gender;
    dateOfBirth: string;
    entries?: Entry[];
}

export type NewDiagnosticsEntry = z.infer<typeof newDiagnosticsSchema>;
export type NewPatientEntry = z.infer<typeof patientEntrySchema>;
export type FilteredFields = Omit<Patient, 'ssn' | 'entries'>;