export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

interface BaseEntry {
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: {
        date: string;
        criteria: string;
    };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: {
        startDate: string;
        endDate: string;
    };
}

export interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export type Entry =
    HospitalEntry |
    OccupationalHealthcareEntry |
    HealthCheckEntry;

export interface Patient {
    id: string;
    name: string;
    ssn: string;
    occupation: string;
    gender: Gender;
    dateOfBirth: string;
    entries?: Entry[];
}

export type NewEntry = 
    (Omit<HospitalEntry, 'id' | 'type' > & { type: 'Hospital' }) |
    (Omit<OccupationalHealthcareEntry, 'id' > & { type: 'OccupationalHealthcare' }) |
    (Omit<HealthCheckEntry, 'id' > & { type: 'HealthCheck'
});

export type PatientFormValues = Omit<Patient, "id">;